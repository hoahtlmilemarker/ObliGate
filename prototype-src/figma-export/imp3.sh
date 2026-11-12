Q="?promptId=3f6b0c1e-4a2d-4f7e-9b8c-5d1e2a3b4c60&cssSelector=.fig-state"; B="https://mcp.figma.com/mcp/html_to_figma"
while read id f; do r=$(curl -sS -m 300 -X POST "$B/$id/submit$Q" -H "Content-Type: text/html" --data-binary @comb/$f.html); echo "$f $r"; done <<'L'
dbd83760-6db1-4ea4-a73f-055f1cb8c6cc 00-sign-in
88c2920d-bfd0-41cd-bc7b-454b2c6a6eb7 01-disaster-portfolio
f9fea312-2cb6-4413-903d-015de9f966e3 02-project-detail
b3709005-82ce-4ac8-a3aa-3c0f7d184759 03-document-library__light
837e544a-f5fb-4772-9d38-8700ef4020dc 03-document-library__dark
e2179cab-4e7d-44ba-8700-178dee2e978b 03b-document-library-empty
efaf8f99-11b7-4c78-bc15-1eebce9f9d88 03c-unplaced-inbox
7ac3c0af-6535-42ba-abc2-678121bec9b2 04-document-review
b84100ca-56ae-4ffa-a778-1b514f80643e 05-cross-check
fc56e453-160a-4e67-a6e3-959a0278cb6e 06-import-wizard
85a0f9da-f6ac-4dd9-9827-81f15fff48ee 07-presubmission
3c8140a0-8e42-4f37-acba-fcc48e965d94 08-supervisor-signature
51d87c4f-5476-48d8-ad5f-7d9a58f9ef4e 10-my-profile
3bb2c862-452c-4308-85d1-384e73e69339 11-notification-settings
L
