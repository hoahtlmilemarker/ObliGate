import os, zipfile, random, datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, black
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/liberation/'
pdfmetrics.registerFont(TTFont('Mono',F+'LiberationMono-Regular.ttf'))
pdfmetrics.registerFont(TTFont('MonoB',F+'LiberationMono-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Sans',F+'LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Sig','msd.ttf'))
OUT='xf/ObliGate-Cross-Check-documents'; os.makedirs(OUT,exist_ok=True)
INK=HexColor('#1A1A1A'); GRAY=HexColor('#6B6458'); SIGC=HexColor('#1B2A8F'); RED=HexColor('#B4473A'); LINE=HexColor('#2A261F')
W,H=letter; L=54; R=W-54
DESC=['Culvert mud clearing','Heavy debris removal','Rock slide clearing','Shoulder reinforcement','Berm installation']
PM=['4.2','4.2','4.8','5.1','5.4']
def us(iso): y,m,d=iso.split('-'); return f'{m}/{d}/{y}'
def page(c,title,sub='FEMA-4683-DR-CA · EMERGENCY WORK DISASTER RECOVERY'):
    c.setFillColor(INK); c.setFont('MonoB',14); c.drawCentredString(W/2,H-70,'COUNTY OF LOS ANGELES · DEPARTMENT OF PUBLIC WORKS')
    c.setFont('Mono',10.5); c.drawCentredString(W/2,H-90,title)
    c.setFillColor(GRAY); c.setFont('Mono',9); c.drawCentredString(W/2,H-106,sub)
    c.setStrokeColor(LINE); c.setLineWidth(2); c.line(L,H-122,R,H-122)
    c.setFont('Sans',7); c.setFillColor(GRAY); c.drawString(L,30,'SAMPLE DATA · prototype test file for ObliGate. Names, hours and amounts are not real.')
def kv(c,rows,y):
    for a,b,cc,d in rows:
        c.setFillColor(INK); c.setFont('MonoB',9.5); c.drawString(L,y,a); c.setFont('Mono',10); c.drawString(L+130,y,b)
        c.setDash(1,2); c.setStrokeColor(GRAY); c.setLineWidth(.6); c.line(L+128,y-4,L+284,y-4)
        if cc: c.setFont('MonoB',9.5); c.drawString(L+300,y,cc); c.setFont('Mono',10); c.drawString(L+392,y,d); c.line(L+390,y-4,R,y-4)
        c.setDash(); y-=26
    return y
def table(c,y,hdr,widths,rows,aligns,total=None,hl=None):
    x0=L; rh=22
    def row(vals,yy,bold=False,fill=None):
        x=x0
        for i,(v,w) in enumerate(zip(vals,widths)):
            if fill and fill.get(i): c.setFillColor(fill[i]); c.rect(x,yy-rh+6,w,rh,fill=1,stroke=0)
            c.setFillColor(INK if not (fill and fill.get(i)) else RED); c.setFont('MonoB' if bold else 'Mono',9)
            if aligns[i]=='r': c.drawRightString(x+w-6,yy-9,v)
            else: c.drawString(x+6,yy-9,v)
            x+=w
    c.setStrokeColor(black); c.setLineWidth(.8)
    c.setFillColor(HexColor('#F0F0F0')); c.rect(x0,y-rh+6,sum(widths),rh,fill=1,stroke=0); row(hdr,y,True); y-=rh
    for i,r in enumerate(rows):
        row(r,y,False,{len(r)-1:HexColor('#FBEDEA')} if hl==i else None); y-=rh
    if total: row(total,y,True); y-=rh
    n=1+len(rows)+(1 if total else 0); top=y+n*rh+6-rh+rh
    top=y+rh*n+6; bot=y+6
    c.rect(x0,bot,sum(widths),top-bot,fill=0,stroke=1)
    for k in range(1,n): c.line(x0,bot+k*rh,x0+sum(widths),bot+k*rh)
    x=x0
    for w in widths[:-1]: x+=w; c.line(x,bot,x,top)
    return y
def sigs(c,y,a,b):
    for i,(s,lab) in enumerate([a,b]):
        x=L if i==0 else W/2+20; w=(R-L)/2-20
        if s: c.setFillColor(SIGC); c.setFont('Sig',26); c.drawString(x+2,y+6,s)
        c.setStrokeColor(LINE); c.setLineWidth(1); c.line(x,y,x+w,y)
        c.setFillColor(GRAY if 'NOT' not in lab else RED); c.setFont('Mono',8.5); c.drawString(x,y-14,lab)
def timesheet(name,emp,eid,sig,cls,rate,per,reg,ot_day=None,ot=0.0,late=None):
    c=canvas.Canvas(f'{OUT}/{name}',pagesize=letter); page(c,'FORCE-ACCOUNT LABOR DAILY REPORT & SUMMARY TIMESHEET')
    y=kv(c,[('EMPLOYEE NAME:',emp,'EMP ID #:',eid),('CLASSIFICATION:',cls,'HOURLY RATE:',f'${rate} / hr'),('PAY PERIOD:',f'{us(per[0])} - {us(per[1])}','PCA CODE:','PCA-89420')],H-160)
    if reg>40:
        d0=datetime.date.fromisoformat(per[0]); days=[]
        while d0<=datetime.date.fromisoformat(per[1]):
            if d0.weekday()<5: days.append(d0.isoformat())
            d0+=datetime.timedelta(days=1)
    else: days=['2023-01-09','2023-01-10','2023-01-11','2023-01-12','2023-01-13']
    rows=[];hl=None
    for i,dd in enumerate(days):
        o=ot if dd==ot_day else 0.0
        if dd==ot_day: hl=i
        rows.append([us(dd),f'Malibu Cyn Rd PM {PM[i%5]} - {DESC[i%5]}','8.0',f'{o:.1f}'])
    y=table(c,y-16,['Date','Location / Description of Work','Reg Hrs','OT Hrs'],[88,282,68,66],rows,['l','l','r','r'],['','TOTAL HOURS:',f'{8*len(days):.1f}',f'{ot:.1f}'],hl)
    sigs(c,y-60,(sig,f'Employee Signature ({us(per[1])})'),('Heidi Liu, PE',f'Supervisor Attestation ({late or us(per[1])})'))
    c.save()
def actlog(name,date,hrs,desc,crew='Culvert Clearing Crew',size=4):
    c=canvas.Canvas(f'{OUT}/{name}',pagesize=letter); page(c,'DAILY ACTIVITY LOG · FIELD CREW REPORT')
    y=kv(c,[('CREW:',crew,'WORK DATE:',date),('CREW SIZE:',f'{size} members','PROJECT:','PW-00428'),('TOTAL CREW HRS:',f'{hrs} hrs','','')],H-160)
    c.setStrokeColor(HexColor('#D8D2C4')); c.rect(L,y-60,R-L,56,stroke=1,fill=0)
    c.setFillColor(INK); c.setFont('MonoB',9); c.drawString(L+10,y-22,'WORK PERFORMED:'); c.setFont('Mono',9); c.drawString(L+10,y-38,desc+'.'); c.drawString(L+10,y-52,'Equipment on site: CAT 320 Excavator (#EQ-PW-109).')
    sigs(c,y-130,('Heidi Liu, PE','Crew Supervisor'),('','Reviewed by')); c.save()
def suplog(name):
    c=canvas.Canvas(f'{OUT}/{name}',pagesize=letter); page(c,'SUPERVISOR FIELD LOG · SHIFT ATTESTATION')
    y=kv(c,[('SUPERVISOR:','Liu, Heidi','TITLE:','Resident Engineer'),('SHIFTS:','01/14/2023 - 01/16/2023','HOURS:','24.0 hrs')],H-160)
    y=table(c,y-16,['Date','Shift','Crew','Hours'],[110,160,150,84],[['01/14/2023','07:00 - 15:00','Culvert Clearing Crew','8.0'],['01/15/2023','07:00 - 15:00','Culvert Clearing Crew','8.0'],['01/16/2023','07:00 - 15:00','Culvert Clearing Crew','8.0']],['l','l','l','r'],['','','TOTAL:','24.0'])
    c.setFillColor(INK); c.setFont('Mono',9); c.drawString(L,y-24,'Shift logs for Malibu Cyn Rd emergency work, Jan 14-16 2023.')
    sigs(c,y-90,('','Supervisor Signature - NOT SIGNED'),('','Date')); c.save()
def eqlog(name):
    c=canvas.Canvas(f'{OUT}/{name}',pagesize=letter); page(c,'EQUIPMENT USAGE LOG')
    y=kv(c,[('EQUIPMENT:','CAT 320 Excavator','EQUIP ID:','#EQ-PW-109'),('PERIOD:','01/09/2023 - 01/13/2023','HOURS:','40.0 hrs')],H-160)
    y=table(c,y-16,['Date','Operator','Hours'],[130,290,84],[[us(d),'Aguayo, Hector','8.0'] for d in ['2023-01-09','2023-01-10','2023-01-11','2023-01-12','2023-01-13']],['l','l','r'],['','TOTAL:','40.0'])
    sigs(c,y-60,('R. Keith','Fleet Supervisor'),('','Reviewed by')); c.save()
def xl(name,pps,nrows):
    wb=Workbook(); ws=wb.active; ws.title='eCAPS Labor'
    ws.append(['SAMPLE DATA · eCAPS DeRS payroll export for ObliGate testing']); ws['A1'].font=Font(bold=True,color='B08A4E')
    hdr=['Employee','Emp ID','Pay Period','Work Date','Regular Hours','OT Hours','Base Rate','Amount','PCA Code','Project']; ws.append(hdr)
    for cc in ws[2]: cc.font=Font(bold=True,color='FFFFFF'); cc.fill=PatternFill('solid',fgColor='06243F')
    people=[('Aguayo, Hector',609142,54.20),('Delgado, Marco',609188,48.50),('Chen, Lawrence',609201,54.20),('Santos, Maria',609233,54.20)]
    extra=[('Nguyen, An',609240,46.80),('Lopez, Maria',609310,44.10),('Keith, Robert',609155,58.75),('Patel, Ravi',609277,52.30),('Kim, Grace',609290,49.90),('Brooks, Dana',609301,47.25)]
    random.seed(7); n=0; tot=0
    while n<nrows:
        for pp in pps:
            start=datetime.date(2022,12,18)+datetime.timedelta(days=14*(pp-1))
            for (nm,i,r) in people+extra:
                for k in range(10):
                    if n>=nrows: break
                    d=start+datetime.timedelta(days=k+(k//5)*2)
                    ot=8.0 if (nm.startswith('Aguayo') and d.isoformat()=='2023-01-12') else 0.0
                    amt=round(8*r+ot*r*1.5,2); tot+=amt
                    ws.append([nm,i,f'PP {pp:02d}',d.isoformat(),8.0,ot,r,amt,'PCA-89420','PW-00428']); n+=1
        if n<nrows and len(pps)==1: pps=pps
    for col,w in zip('ABCDEFGHIJ',[20,10,11,12,13,10,10,12,11,10]): ws.column_dimensions[col].width=w
    wb.save(f'{OUT}/{name}')
def photo(name,label):
    im=Image.new('RGB',(1600,1067),(74,92,74)); d=ImageDraw.Draw(im); random.seed(len(name))
    for i in range(0,1067,6): d.line([(0,i),(1600,i+random.randint(60,160))],fill=(80+random.randint(0,30),95+random.randint(0,25),78),width=3)
    d.rectangle([0,760,1600,1067],fill=(96,86,70))
    f=ImageFont.truetype(F+'LiberationSans-Bold.ttf',52); f2=ImageFont.truetype(F+'LiberationSans-Regular.ttf',30)
    d.rectangle([40,40,1560,1027],outline=(255,255,255),width=4)
    d.text((80,840),label,fill=(255,255,255),font=f); d.text((80,915),'SAMPLE PHOTO · prototype test file, not a real site photo',fill=(230,215,180),font=f2)
    im.save(f'{OUT}/{name}',quality=86)

timesheet('Timesheet_Aguayo_PayPeriod_02.pdf','Aguayo, Hector','#609142','Hector Aguayo','Heavy Equipment Operator','54.20',['2023-01-01','2023-01-14'],40,'2023-01-12',8.0,'01/15/2023')
actlog('ActivityLog_PW00428_Jan12_Crew3.pdf','01/12/2023','32.0','Shoulder reinforcement, Malibu Cyn Rd PM 5.1 - 07:00 to 19:30 (Aguayo: 4.0 h OT)')
xl('eCAPS_Labor_Export_F7060865.xlsx',[1,2,3,4],167)
suplog('SupervisorLog_Jan14-16_Unsigned.pdf')
timesheet('Timesheet_Delgado_PayPeriod_02.pdf','Delgado, Marco','#609188','Marco Delgado','Laborer','48.50',['2023-01-01','2023-01-14'],40)
eqlog('EquipLog_CAT320_EQ-PW-109_Jan.pdf')
timesheet('Timesheet_Chen_PayPeriod_02.pdf','Chen, Lawrence','#609201','Lawrence Chen','Equipment Operator','54.20',['2023-01-01','2023-01-14'],40)
photo('FieldPhoto_MalibuCyn_PM5.1_Jan12.jpg','Malibu Cyn Rd PM 5.1 · Jan 12, 2023')
timesheet('Timesheet_Santos_PayPeriod_02.pdf','Santos, Maria','#609233','Maria Santos','Laborer','54.20',['2023-01-01','2023-01-14'],40)
actlog('ActivityLog_PW00428_Jan10_Crew3.pdf','01/10/2023','32.0','Heavy debris removal, Malibu Cyn Rd PM 4.2')
actlog('ActivityLog_PW00428_Jan13_Crew3.pdf','01/13/2023','32.0','Berm installation, Malibu Cyn Rd PM 5.4 (one sign-out time illegible)')
timesheet('Timesheet_Aguayo_PayPeriod_01.pdf','Aguayo, Hector','#609142','Hector Aguayo','Heavy Equipment Operator','54.20',['2022-12-18','2022-12-31'],80)
xl('eCAPS_Labor_Export_PP01.xlsx',[1],42)
photo('FieldPhoto_MalibuCyn_Jan09.jpg','Malibu Cyn Rd PM 4.2 · Jan 9, 2023')
open(f'{OUT}/README.txt','w').write('''ObliGate - Force-Account Labor test documents (SAMPLE DATA ONLY)

These 14 files match the documents shown in the Document Library (PW-00428 > 1. Force-Account Labor),
Document Review and Cross-Check screens. Names, hours and amounts are invented.

What each file is meant to trigger:
- Timesheet_Aguayo_PayPeriod_02.pdf ....... 8.0 OT hours claimed on 01/12; the field log supports only 4.0 -> OT Mismatch ($325.20)
- ActivityLog_PW00428_Jan12_Crew3.pdf ..... field log for 01/12, shift 07:00-19:30 (4.0 h OT for Aguayo)
- eCAPS_Labor_Export_F7060865.xlsx ........ payroll baseline PP 01-PP 04, 167 rows
- SupervisorLog_Jan14-16_Unsigned.pdf ..... 24.0 h, supervisor signature missing -> Missing Signature
- Timesheet_Delgado_PayPeriod_02.pdf ...... 40.0 h claimed, no matching daily log -> Missing Log
- EquipLog_CAT320_EQ-PW-109_Jan.pdf ....... equipment hours, matches operator Aguayo
- Timesheet_Chen_PayPeriod_02.pdf ......... matched
- Timesheet_Santos_PayPeriod_02.pdf ....... matched
- FieldPhoto_MalibuCyn_PM5.1_Jan12.jpg .... site photo (evidence)
- ActivityLog_PW00428_Jan10_Crew3.pdf ..... verified
- ActivityLog_PW00428_Jan13_Crew3.pdf ..... low confidence (illegible sign-out)
- Timesheet_Aguayo_PayPeriod_01.pdf ....... previous pay period, verified
- eCAPS_Labor_Export_PP01.xlsx ............ PP 01 only, 42 rows
- FieldPhoto_MalibuCyn_Jan09.jpg .......... site photo (evidence)

Note: the prototype decides results from the file name and its built-in sample data; it does not read file contents.
''')
z='xf/ObliGate-Cross-Check-documents.zip'
with zipfile.ZipFile(z,'w',zipfile.ZIP_DEFLATED) as zf:
    for f in sorted(os.listdir(OUT)): zf.write(f'{OUT}/{f}','ObliGate-Cross-Check-documents/'+f)
print(sorted(os.listdir(OUT)))
