Q="?promptId=3f6b0c1e-4a2d-4f7e-9b8c-5d1e2a3b4c60&cssSelector=.fig-state"; B="https://mcp.figma.com/mcp/html_to_figma"
while read id f; do r=$(curl -sS -m 600 -X POST "$B/$id/submit$Q" -H "Content-Type: text/html" --data-binary @comb/$f.html | head -c 400 | tr '\n' ' '); echo "$f $r"; done <<'L'
c18e0fd8-13bf-43b1-abd1-d999dea8ad8d 00-sign-in
aa039e6a-94c6-4909-90dd-0413499f3d4e 01-disaster-portfolio
2ebac416-e6a0-4813-b933-685cb4f96233 02-project-detail
6340b208-d8a5-4ea1-91b5-f32e050be332 03-document-library__light
4888e31f-4717-4212-ad62-90dcd2121c3e 03-document-library__dark
ba69b950-671d-4e8e-93a3-74bdb1a9daf2 03b-document-library-empty
b15e2482-d74c-474e-92bb-fd3e8178711c 03c-unplaced-inbox
ae71af06-8d9c-4aae-b1c9-4dc198f00c80 04-document-review
cf10871b-7b1a-4e15-a0b0-f47c38e90da8 05-cross-check
675f4601-5668-4553-8f8f-81d9c1f44f2d 06-import-wizard
88abb269-3897-41cf-a0dd-3b3e7444fa72 07-presubmission
ccc27ffb-27f1-47ad-9908-cd803457189d 08-supervisor-signature
1238e097-36e5-4cca-9975-7dd22b702a0a 10-my-profile
e396c784-ae4f-4f78-bbb2-9f03d9da08d9 11-notification-settings
L
echo DONE
