import os, zipfile
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
from PIL import Image, ImageDraw, ImageFont

OUT='/tmp/claude-0/-home-claude/4a074e53-8b44-5dac-a9f9-aca9f17dac8a/scratchpad/samples/ObliGate-test-files'
os.makedirs(OUT, exist_ok=True)
NAVY=HexColor('#06243F'); BRASS=HexColor('#B08A4E'); GRAY=HexColor('#5B6B7A')

def pdf(name, title, sub, rows, note=None, sign=None):
    c=canvas.Canvas(os.path.join(OUT,name),pagesize=letter); W,H=letter
    c.setFillColor(NAVY); c.rect(0,H-70,W,70,fill=1,stroke=0)
    c.setFillColor(HexColor('#FFFFFF')); c.setFont('Helvetica-Bold',15); c.drawString(48,H-40,'LA County Public Works')
    c.setFont('Helvetica',9); c.drawString(48,H-56,sub)
    c.setFillColor(BRASS); c.drawRightString(W-48,H-40,'SAMPLE DATA · FOR TESTING ONLY')
    c.setFillColor(NAVY); c.setFont('Helvetica-Bold',18); c.drawString(48,H-110,title)
    y=H-145
    for k,v in rows:
        c.setFont('Helvetica',8.5); c.setFillColor(GRAY); c.drawString(48,y,k.upper())
        c.setFont('Helvetica',11); c.setFillColor(NAVY); c.drawString(200,y,v)
        c.setStrokeColor(HexColor('#D5D9DC')); c.line(48,y-8,W-48,y-8); y-=26
    if note:
        y-=10; c.setFont('Helvetica-Oblique',10.5); c.setFillColor(NAVY)
        for line in note: c.drawString(48,y,line); y-=16
    y-=30
    c.setStrokeColor(NAVY); c.line(48,y,280,y); c.setFont('Helvetica',9); c.setFillColor(GRAY)
    c.drawString(48,y-14,sign or 'Supervisor signature: ________________  (NOT SIGNED)')
    c.setFont('Helvetica',7.5); c.drawString(48,30,'Prototype test file generated for ObliGate. Names, hours and amounts are sample data.')
    c.save()

def photo(name, label, color):
    im=Image.new('RGB',(1200,800),color); d=ImageDraw.Draw(im)
    for i in range(0,800,8): d.line([(0,i),(1200,i+120)],fill=tuple(min(255,x+10) for x in color),width=2)
    d.rectangle([40,40,1160,760],outline=(255,255,255),width=4)
    try: f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',44); f2=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',26)
    except: f=f2=ImageFont.load_default()
    d.text((80,320),label,fill=(255,255,255),font=f); d.text((80,390),'SAMPLE PHOTO · FOR TESTING ONLY',fill=(230,220,190),font=f2)
    im.save(os.path.join(OUT,name),quality=85)

# --- the 6 files shown in "Try it with sample files" ---
pdf('Timesheet_Aguayo_PP02.pdf','Force-Account Timesheet','DR-4683-CA · PW-00428 Malibu Canyon · Pay Period 02',
    [('Employee','Hector Aguayo (#609142)'),('Title','Heavy Equipment Operator'),('Date','Thursday, January 12, 2023'),('Shift','07:00 – 23:30'),('Regular','8.0 h'),('Emergency OT','8.0 h'),('Equipment','CAT 320 Excavator #EQ-PW-109')])
pdf('ActivityLog_PW00428_Jan18.pdf','Daily Activity Log','DR-4683-CA · PW-00428 Malibu Canyon',
    [('Date','Wednesday, January 18, 2023'),('Crew','Culvert Clearing Crew · 4 members'),('Location','Malibu Canyon Road, PM 4.2 to PM 5.8'),('Hours','32.0 crew hours')],
    ['Cleared debris from culvert inlet; removed unstable rock overhang.'],sign='Supervisor: Heidi Liu, PE  (signed)')
pdf('SupervisorLog_Jan14-16_Unsigned.pdf','Supervisor Field Log','DR-4683-CA · PW-00428 Malibu Canyon',
    [('Dates','January 14 – 16, 2023'),('Supervisor','Heidi Liu, PE'),('Crew hours','24.0 h'),('Status','Awaiting signature')])
pdf('EquipLog_CAT320_EQ-PW-109_Jan.pdf','Equipment Usage Log','DR-4683-CA · PW-00428 Malibu Canyon',
    [('Equipment','CAT 320 Hydraulic Excavator'),('Asset','#EQ-PW-109'),('Month','January 2023'),('Hours','40.0 h'),('Operator','Hector Aguayo')],sign='Fleet supervisor: R. Keith  (signed)')
wb=Workbook(); ws=wb.active; ws.title='Labor PP01-04'
hdr=['Employee','ID','Pay Period','Date','Regular Hours','OT Hours','Rate','Amount','Project']
ws.append(['SAMPLE DATA · FOR TESTING ONLY']); ws['A1'].font=Font(bold=True,color='B08A4E'); ws.append(hdr)
for c in ws[2]: c.font=Font(bold=True,color='FFFFFF'); c.fill=PatternFill('solid',fgColor='06243F')
import random; random.seed(4)
names=[('Aguayo, Hector',609142,81.30),('Delgado, Marco',609188,62.10),('Chen, Lawrence',609201,67.75),('Nguyen, An',609233,58.40)]
for pp in range(1,5):
    for n,i,r in names:
        reg=8.0; ot=random.choice([0,2,4,8]); ws.append([n,i,f'PP0{pp}',f'2023-01-{(pp-1)*7+9:02d}',reg,ot,r,round(reg*r+ot*r*1.5,2),'PW-00428'])
for col,w in zip('ABCDEFGHI',[20,10,11,12,13,10,8,11,10]): ws.column_dimensions[col].width=w
wb.save(os.path.join(OUT,'eCAPS_Labor_Export_PP01-04.xlsx'))
photo('FieldPhoto_MalibuCyn_Jan09.jpg','Malibu Canyon Rd · Jan 9, 2023',(70,92,72))

# --- extra cases to test placement ---
pdf('Timesheet_Lopez_PW00429_PP03.pdf','Force-Account Timesheet','DR-4683-CA · PW-00429 Topanga Creek Debris · Pay Period 03',
    [('Employee','Maria Lopez (#609310)'),('Title','Laborer'),('Date','Tuesday, January 24, 2023'),('Regular','8.0 h'),('Emergency OT','4.0 h')])
pdf('Invoice_PW-00433_GraniteCo.pdf','Vendor Invoice','DR-4683-CA · PW-00433 Big Tujunga Canyon Road Washout',
    [('Vendor','Granite Construction (sample)'),('Invoice','INV-2023-0117'),('Amount','$48,600.00'),('Contract','Not attached')])
pdf('FieldLog_DR4699_Jan20.pdf','Daily Field Log','DR-4699-CA · no project assigned',
    [('Date','Friday, January 20, 2023'),('Location','Unincorporated LA County'),('Hours','16.0 crew hours')])
photo('Receipt_HomeDepot_0112.jpg','Receipt · sandbags & tarps · $1,284.50',(120,110,92))
photo('IMG_4520.jpg','Unlabeled photo',(60,70,90))
pdf('Meeting_Notes.pdf','Meeting notes','Internal',[('Topic','Weekly coordination'),('Attendees','4')],sign=' ')

open(os.path.join(OUT,'README.txt'),'w').write('''ObliGate test files (sample data only)

Upload these on the Upload Records page. The prototype decides placement from the FILE NAME only.

Expected result:
- Timesheet_Aguayo_PP02.pdf ............ PW-00428 Force-Account Labor, critical finding (no supervisor signature)
- ActivityLog_PW00428_Jan18.pdf ........ PW-00428 Force-Account Labor, filed automatically
- eCAPS_Labor_Export_PP01-04.xlsx ...... PW-00428 Force-Account Labor, advisory (payroll not matched to field logs)
- SupervisorLog_Jan14-16_Unsigned.pdf .. PW-00428 Force-Account Labor, critical finding (field log not signed)
- EquipLog_CAT320_EQ-PW-109_Jan.pdf .... PW-00428 Equipment Records, filed automatically
- FieldPhoto_MalibuCyn_Jan09.jpg ....... PW-00428 Equipment Records, "Check" (60-84% sure)
- Timesheet_Lopez_PW00429_PP03.pdf ..... PW-00429 Force-Account Labor, critical finding
- Invoice_PW-00433_GraniteCo.pdf ....... PW-00433 Contracts & Procurement, advisory
- Receipt_HomeDepot_0112.jpg ........... PW-00428 Materials & Supplies, "Check"
- FieldLog_DR4699_Jan20.pdf ............ Unplaced Inbox (belongs to DR-4699-CA)
- IMG_4520.jpg ......................... Unplaced Inbox (AI suggests a folder, under 60% sure)
- Meeting_Notes.pdf .................... Unplaced Inbox (no suggestion; remove it)

Upload the same files a second time to test the duplicate check.
''')
z=os.path.join(os.path.dirname(OUT),'ObliGate-test-files.zip')
with zipfile.ZipFile(z,'w',zipfile.ZIP_DEFLATED) as zf:
    for f in sorted(os.listdir(OUT)): zf.write(os.path.join(OUT,f),'ObliGate-test-files/'+f)
print(z, sorted(os.listdir(OUT)))
