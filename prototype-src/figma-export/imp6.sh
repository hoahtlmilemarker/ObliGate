Q="?promptId=c4d2e8a1-7f3b-4e6a-9c1d-2b5e8f0a3d71&cssSelector=.fig-state"; B="https://mcp.figma.com/mcp/html_to_figma"
while read id f; do r=$(curl -sS -m 600 -X POST "$B/$id/submit$Q" -H "Content-Type: text/html" --data-binary @comb3/$f.html | head -c 200 | tr '\n' ' '); echo "$f $r"; done <<'L'
bf0eb235-1390-4c41-95b3-75e8b4cca388 09-auth-signin
5e375755-a3cd-48e1-948b-4599926fe308 01-disaster-portfolio
3d0649bb-fd83-41b2-b663-ae425f65cce1 02-project-detail
0d57db1f-be98-4a1f-87c2-a03b5bbbe5ca 03-document-library
ddb0b422-82a4-447a-990c-fcbb0cfc35b1 03b-document-library-empty
7692df70-f894-4470-8a09-dc3fb4e63fd3 03c-unplaced-inbox
094ba393-1fd3-4a85-97f2-d2a1dabbe9ba 04-document-review
6bc30969-e5ab-4e67-9dd0-4b0f58bfb048 05-cross-check
3acfb2fe-e087-4b43-8e2a-c43397d53dbc 06-import-wizard
c1719c26-c1cf-4e72-806c-a290c8b280e5 07-presubmission
f809acd4-83b6-42bf-831f-e5f5b26352df 08-supervisor-signature
38f3a658-9233-4a49-9b01-d14084c88506 10-my-profile
726fae16-8a08-49b4-9d86-f821862df64d 11-notification-settings
L
echo DONE
