Q="?promptId=9a7c2e41-5b3d-4c8f-a1e2-6f4d3c2b1a90&cssSelector=.fig-state"; B="https://mcp.figma.com/mcp/html_to_figma"
while read id f; do r=$(curl -sS -m 600 -X POST "$B/$id/submit$Q" -H "Content-Type: text/html" --data-binary @comb3/$f.html | head -c 300 | tr '\n' ' '); echo "$f $r"; done <<'L'
cce42ba6-609d-4078-9666-e55ee46703bc 09-auth-signin
200506ab-6655-439a-a951-3bd77e861d3e 01-disaster-portfolio
69087a89-c095-4524-8f08-db02db98ccfb 02-project-detail
3ffcf688-6025-4d9d-822e-9f755ddd00e3 03-document-library
85f698a1-7bf7-4590-9c8a-b4258c618759 03b-document-library-empty
4ae2c3d0-34f7-4c5d-8dc0-3498651b1e6f 03c-unplaced-inbox
3f249fd5-3f28-42d6-bc92-bccc96d7a8c3 04-document-review
a45a5019-388c-4d08-a298-116ea61cf31a 05-cross-check
7753a861-286b-4541-b441-8cf7c804a51e 06-import-wizard
6045ff6e-61b6-4e74-9578-7a9b285bf123 07-presubmission
26b7f85a-070b-4ffb-8997-110c5cff8813 08-supervisor-signature
a21ab214-20a6-444c-a5a1-6fd0ebfecc1c 10-my-profile
165c8d93-e78b-446a-a719-063b31527708 11-notification-settings
L
echo DONE
