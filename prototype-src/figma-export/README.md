# HTML → Figma export pipeline (prototype)

Used to push prototype pages into Figma file `lv1353jfBZdCOuM3LIInC7` (one Figma page per screen; Light row on top, Dark row below; Tablet 768 / Mobile 390 beside them).

1. Build the prototype (`../build.sh`), then render each state to frozen HTML: `python3 runjobs.py` (uses `snap.js`, jobs in `jobs.json`).
2. Combine the states of one screen into a single HTML (`combine2.js`), each state in a `.fig-state` element. Never include the review layer (`[data-review-ui]`).
3. Call the Figma MCP tool `html_to_figma` to get a capture id per screen, then POST the combined HTML:
   `curl -X POST "https://mcp.figma.com/mcp/html_to_figma/<id>/submit?promptId=<uuid>&cssSelector=.fig-state" -H "Content-Type: text/html" --data-binary @<file>.html` (see `imp6.sh`).
4. Lay out the imported frames on the page with `use_figma` (`lay_67_*.js`).

Only redo the screens that were asked for; do not rebuild frames that are already done.
Note (2026-11-12): `html_to_figma` was not exposed to the Claude session that day although the connector was connected.
