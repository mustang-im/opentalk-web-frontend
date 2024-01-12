## Unreleased

### New Features

- Add streaming options to create meeting ([#1587](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1587))

### Improvements to the user experience

- Switch off media devices if user aborts reconnect ([#1531](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1531))
- Improve virtual background quality by introducing confidence thresholds ([#1595](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1595))
- Improved accessibility of dashboard main navigation. ([#1641](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1641))
- More menu buttons on the meetings page are interactive using `space` or `enter` key. ([#1647](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1647))
- Aligned the page language with the chosen application language to enhance the pronunciation accuracy of screen readers. ([#1272](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1272))
- Chat input gets autofocused upon private and group message opening. ([#1287](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1287))
- Hide moderator functionalities from non moderators in the mobile view. ([#1620](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1620))

### Bug Fixes

- Added translation to aria label on the chat emoji button. ([#1275](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1275))
- Fix: Error on late publisher reconnect ([#1583](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/merge_requests/1158))
- Fix missing unread global chat message indicator in mobile view. ([#1610](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1610))
- Fix partially visible notification on smaller mobile devices. ([#1568](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1568))
- Fix/refactor recurrence event instance creation ([#1618](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1618))


## 1.8.0

### New Features

- Added granting/revoking the moderator role in dashboard ([#1464](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1429))
- Add quick start guide ([#1525](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1525))

### Improvements to the user experience

- Implementing new auth provider ([#1598](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1598))
- Chat no longer discards draft message when hidden ([#1596](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1596))
- Rework the participants list in dashboard ([#1464](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1464))
- Improved look of participants in the waiting room with user friendlier indicator that there are more participants than shown ([#1570](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1570))

### Bug Fixes

- Fix logic bug in reservation logic, which might lead to 'black' videos. ([#1611](https://git.open  talk.dev/opentalk/frontend/web/web-app/-/issues/1611))
- Remove hardcoded default values for survey feature ([#1605](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1605))


## 1.7.2

### Improvements to the user experience

- Denying recording consent will block media publishing, but notify. ([#1547](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1547))

### Bug Fixes

- Increase heartbeat interval


## 1.7.1

### New Features

- Show voting results of live vote and roll_call even the participant has not yet voted or saved ([#1425](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1425))
- Add mobile drawer ([#1120](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1120))

### Improvements to the user experience

- Mobile users are notified with the indicator when new message occures and/or whiteboard, shared folder or protocol features are available ([#1483](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1483))
- Change invite link generation ([#1420](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1420))
- Show link to recorded file only to explicitly invited users ([#1536](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1536))
- Standardize handraise icon in the toolbar to match other buttons ([#1558](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1558))
- Show Meeting Title in lobby & waiting room ([#1398](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1398))
- Enhanced behavior of the room participant selection ([#1500](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1500))

### Bug Fixes

- Fix Password notification don't disappear ([#1591](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1591))
- Fix popovers in the fullscreen mode for three dot menu and hang up confirmation. ([#1535](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1535))
- Fix notifications not being display on the personal fullscreen mode ([1504](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1504))


## 1.7.0

### New Features

- Show voting results of live vote even the participant has not yet voted or saved ([#1425](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1425))

### Improvements to the user experience

- Improve date time picker behaviour ([#1046](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1046))
- Remove the dialog from Ad-Hoc meetings at the end ([#1113](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1113))
- Safari: change button color for browser notification ([#1485](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1485))
- Change wording for inviting field ([#1533](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1533))
- Change wording of dashboard password field ([#1527](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1527))
- Change allow button color in recording consent dialog ([#1508](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1508))
- Add time to join/leaving event in chat list ([#1510](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1510))
- Remove the redundant login screen - fixed redirect ([#1360, #1463](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1360, https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1463))
- Fix: [Lobby] no feedback for wrong password ([1440](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1440))
- Increase size of toolbar buttons for mobile user ([#1460](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1460))
- Customize Glitchtip user feedback dialog labels ([#1452](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1452))
- Improved loading time of the participant list with over 100 participants in the room. ([#1487](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/work_items/1487))
- Improve performance while scrolling both long personal, group or global chats. ([#1422](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1422))
- Enhanced behavior of the room participant selection ([#1500](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1500))
- Unauthorized users can no longer open meeting details page where they are not invited ([#1540](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1540))

### Bug Fixes

- Fix meeting layout after hangup action in fullscreen mode ([#1032](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1032))
- Fix participant button appearance on meeting edit page to look clickable ([#1457](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1457))
- Fix Password notification don't disappear ([#1591](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1591))
- Updating @babel/traverse to 7.23.2 ([#1569](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1569))
- Implementing ping-pong control protocol with the server to check the websocket connection. ([#1554](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1554))
- Fix waiting participants, which rejoined after debriefing([#1262](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1262))
- Fix push-to-talk functionality ([#1344](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1344))
- Fix handling with disallow custom display name ([!1089](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/merge_requests/1089))
- Fix overflowing details on the meeting details page ([#1144](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1144))

### Stability Improvements

- Make meeting room header mobile responsive ([#1447](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1447))

### Internal

- upload source maps for better stacktrace in error reports ([#1081](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/merge_requests/1081))

## 1.6.x

### UI/UX Fixes

- Change the naming for voting in accordance with the municipal code ([#1424](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1424))
- Fix guest link generation in the dashboard (!1066)
- Fix: future meetings displayed in past tabs (!1057)
- Fix participants timer state in moderators timer tab (!1404)
- Fix functionality to set avatar default image (!1034)
- Remove extra space from url in MeetinPopover.tsx (!1050)
- Add missing documentation for ACCOUNT_MANAGEMENT_URL (!1036)
- Fix error handling on update displayname in dashboard (!1026)
- Fix unhandled shared folder update message (!1010)
- Remove settings if provided by a service provider (!1000)
- Add missing names to toolbar buttons (!988)
- Change tariff to plan in english translation (!1004)
- Fix styling of the voting kind dropdown (!989)
- Fix german term for talking stick (!1012)
- Remove unmute button for already unmuted talking stick participant (!1009)
- Fixed overflowing layout issues in all features (!1011)
- Fix broken breakout room notification (!1024)
- Reverted missing label for invite participates when tariff is not applied (!1037)
- Fix german "Hintergrundfilter" translation (!1038)

### Stability Improvements

- Trigger media reconnect when 'connectionstate' is failed (#1489)
- Rework media stream quality reservation (!1019)
- Cleanup video components (!1067)
- Make pipeline fail on failed tests in packages (!1049)
- Unable to enter the meeting - user gets redirected to Dashbaord (!1053)
- Fix tests in common package (!1007)
- Update the semver package to >=7.5.2 (!1002)
- Fix tests failing after moving accountManagementUrl (!1005)
- Extend hot reload functionality for packages (!966)
- Use single snackbar provider (!994)
- Upgrade test packages to remove unmaintained packaged (!1006)
- Improve sidebar tab definition, types and accessibility (!997)
- Fix WebRTC stats error in Safari for missing remote report (!1014)
- Rework most timer/coffee break related components and slices (!1018)
- Fix rerendering issue with chat and participant tab (!1032)
- "You are next" notification in the talking stick no longer auto close (!1027)
- Optimized lobby field wording (!1028)
- Notification for own message in group chat is no longer shown (!1029)
- Fix hotkeys not working as expected (!1040)
- Fix timer countdown for the moderator (!1031)
- Automatic reconnection attempt every 5 seconds when connection breaks (!1059)

### New Features

- Implement experimental client-side voice detection (!1023)
- Disable editing of display name depending on configuration flag (!1056)
- Add copy meeting link and guest link to dashboard meeting 3-dot menue (!1033)
- Display and pin remote sharedscreen automatically(!998)
- Add legal entry to the dashboard (!1020)
- Add a new call_in field to the room field of events (!999)
- Hide dial-in option when no call-in info is sent (!1001)
- Glitchtip integration (!1016)
- Control talking stick with the shortcut (!1013)
- Add ability to revoke event invitation from invited participant. (!1035)
- Add safari warning notification (!1041)

## 1.5.0

### UI/UX Fixes

- Fix: Redirect user to lobby page after remove participant action (Safari) (!920)
- Fix: Legal vote token not being completely visible (!967)
- Fix: Legal vote results are not visible to every participant (!967)
- Fix: Close the conference when time limit quota is elapsed (!974)
- Fix: Update chat indicator correctly (!975)
- Fix: Add missing focus style on the new message button (!958)
- Fix: Better title in English coffee break screen (!987)
- Fix: new message dialog tab order (!965)
- Fix: automatically open talking stick tab for moderator on start (!960)
- Fix: make clear search button focusable with tab key (!961)
- Add translated labels to emoji and send button (!959)
- Disable time limit notifications in the lobby (!955)
- Fix time limit notification for guests joined at the end (!955)
- Fix emoji picker popover cutoff on small devices (!952)
- Add missing labels to view selection drop-down menu (!951)
- Secure connection information is more eye-catching for the user (!949)
- Fix: Remove console error message when closing a running vote (!996)

### Stability Improvements

- Fix: audio was not working after switching audio device (Safari) (!983)
- Tweak bandwidth control for lossy networks (!985)
- Fix crash on leaving conference after switching between chats (!975)
- Add aria labels to camera and microphone option buttons (!972)
- Improve keyboard accessibility of video and audio context menus (!973)
- Fix: Correct the handling media and connection change events (!976)
- Remove redux from the dependencies (!962)

### New Features

- Add category filters to meeting overview in dashboard (!968)
- Add version badge to Dashboard and 'MoreMenu' (!981)
- Show payment warning in dashboard if there is a payment issue (!982)
- Show imprint and data protection footer in the lobby and waiting room (!984)
- Show meeting title in the meeting header (!986)
- Change wording and add link to recording stopped notification (!969)
- Add shared folder icon button to the meeting header (!943)
- Add shared folder setup to the dashboard (!947)
- Introduced "Talking Stick"-mode as first auto moderation feature (!912)
- Add chat unread indicator to the home icon (!992)

## 1.4.0

### UI/UX Fixes

- Change Icons, size and label for participants list (!964)
- Translation protect for names & shortcuts against browser-plugins (!956)
- Fix:Different participant avatars for chat and voting (!957)
- Fix: Poll/Voting User not able to submit their poll (!936)
- Highlight the protocol icon on first appearance (!934)
- Fix German 'Protokoll ausblenden label' (!933)
- Fix audio/video permission denied message (!931)
- Fix sorting of participants by last active (!929)
- Fix the legal vote token copy text for German users (!935)
- Fix both coffee break and timer tabs being disabled (!918)

### Stability Improvements

- Fix: Guest user unable to join meeting after 401 error handling (!945)
- Forbidden results break the app (!944)
- Fix: failed request will cause endless loop (!928)
- Improving development workflow for external libraries (!908)
- Add separate keys for moderation sidebar tabs (!917)

### New Features

- Rework Notistack integration(!922)
- Add Debriefing in conference (!921)
- Implement dynamic media subscriptions management (!942)

## 1.3.2

### UI/UX Fixes

- Fix legal vote popover layout issues (!927)
- Disable starting of a legal vote/poll when a coffee break is active
- Fix the app crash on moderator join event when media is undefined (!925)
- Disable starting of a legal vote/poll when a coffee break is active (!916)
- Fix minimum allowed value in the poll timer. (!897)
- Fix unresponsive hang up button on participant leave. (!903)
- Fix cross icon showing on timer without ready check (!919)

## 1.3.1

### UI/UX Fixes

- Hide legal vote token for unsubmitted users after vote is finished. (!926)
- Disable remote audio while in coffee break view (!924)

## 1.3.0

### UI/UX Fixes

- Stay in coffee break view when a timer is started (!915)
- Fix error on removing phone users from conference (!896)
- Fix legal vote labels after re-joining a meeting (!902)
- Fix some legal vote wordings for German (!880)
- Show no more outdated meetings in dashboard home (!859)
- Rework protocol UX (!866)
- Change UX for whiteboard access (!841)
- Wording coffee break (!862)
- Fix icons missing in chat field (!854)
- Fix Keyboard shortcuts not disabled in smiley search (!854)
- Fix UI for moderation tabs on the side panel for community features (!853)
- Add details for overlapping event dialog (!868)
- Fix not showing participants in the waiting room when moderator is joining after them (!869)
- Fix coffee break English labels (!881)
- Add HotKeys coffee break when full screen is active (!886)
- Fix missing notification when timer stops (!883)
- Fix create meeting default start/end time (!888)
- Fix browser language detection (!889)
- Polished legal vote UI for unselected participant (!893)
- Remove offline participant from the timer list (!901)
- Title texts Coffee break (!898)
- Fix progress bar display for polls and votes (!894)
- Fix UI consistency for legal vote with other tabs (!878)
- Fix Emoji picker container overflowing (!905)
- Fix unwanted timer submitting (!906)

### Stability Improvements

- Renegotiate media connections when tracks fail with on recovery (!899)
- Reconnect media connections when they fail (!887)
- Add connection information to participant stats panel (!849)
- Fix: flickering local video element when start coffee break (!870)
- Clean-up dispatch of legal vote started action (!864)
- Rework duration field and related types (!855)
- Translated emoji picker categories to German (!854)
- Enhanced DurationField behavior (!884)
- Removed development error showing on the create meeting page. (!892)
- Enhanced behavior of poll temporary save (!891)
- Improved legal vote token message on the popover (!900)
- Fix app not building on Safari (!910)

### New Features

- Add account management tab to the dashboard (!930)
- Feat: show quotas information in dashboard (!865)
- Lobby / Waiting room move button / password (!852)
- Add unread indicator for chat messages (!844)
- Add legal vote token copy field (!836)
- Lobby without password label as invited (!863)
- Notify moderator if participant limit has been reached (!877)
- Show room blocker for a participant, that tries to join a full room (!876)
- Add time limit quotas in conference (!875)
- Deactivate modules according to room tariff info (!873)

## 1.2.0

### UI/UX Fixes

- Fix voting status label between different languages (!850)
- Display only a popup instead of the wrong browser page (!830)
- Fix display of new voting, while viewing results of the previous ones (!846)
- Uncheck all checkboxes in the voting popover on every new voting (!842)
- Centralize date and time format (!831)
- Fix styling issues in duration field (!843)
- Fix own icon in people tab showing incorrectly (!879)

### Stability Improvements

- fix toggling mark as done in timer (!867)
- fix typo `updateParticpantsReady` (!867)

### New Features

- coffee break (!827)

## 1.1.0

### UI/UX Fixes

- Fix display of long vote participant names and avatars (!848)
- Fix layout for vote kind selector (!851)
- Enable share screen button on join success (!834)
- Fix LegalVote user selection (!824)
- Fix DateTimePicker issues on mobile (!832)
- Use correct protocol icon in moderation sidebar (!829)
- Fix wrong placed waiting room list (!825)
- Fix too small waiting room list (!826)
- Add an error message for the case that when you start a voting, another voting is already active (!799)
- Merge eeChat into chat (!786)
- Fix dark mode in lobby page (!794)
- Reword the legal vote label from auto stop to auto close (!791)
- Fix incorrect spelling of successfully (!795)
- Fix filtering of upcoming events (!782)
- Legal voting users are unchecked when a new user join into the room or when token is updated (!783)
- Fix active speaker remains on screen after leaving the room (!787)
- Fix wrong German translation "Medienstrom unterbrochenen" (!792)
- Fix legal vote not starting (!797)
- Fix Moderator triggered notifications cannot be seen in full screen mode (!779)
- Fix closing recording and whiteboard notifications after joining active session (!779)
- Fix invited users showing in ad-hoc meeting creation (!793)
- Fix start and end date validation is running on unscheduled meeting (!796)
- Fix error on switching audio device in the lobby page (816)
- Fix create/update meeting step icon styling (!810)
- Fix visuals on the legal vote and poll preview popover (!812)
- Fix DateTimePicker not opening on mobile (!777)

### Stability Improvements

- Fix Firefox sender quality scaling (!839)
- List of participants include phone users (!783)
- Forked notistack to local version in order to enable fullscreen notifications (!779)
- Topic and subtitle fields are no longer mandatory when creating legal vote (!812)
- Reworked legal vote to use voting tickets for more security (!812)

### New Features

- Add an image next to the participant in the participants list if the participant is protocol editor (!803)
- Change the select participants behaviour (!783)
- Placed legal votes are summarized in the table visible by moderator (!812)
- Active legal vote popover has a ticking timer indicating remaining time to place a vote (!812)
- activate session reconnect (!203)


## 1.0.13

### UI/UX Fixes

- Fix: Change working for possible answers and set default true to allow_abstain (!784)
- Fix mobile menu (!778)
- Add the own user to the participant list (!770)
- Remove chat message error on blur (!769)
- change wording DE in permission for moderator rights (!771)
- Fix grouping meetings by week in dashboard (!773)
- Remove "overlapping event" pop-up when creating unscheduled event (!772)
- Fixed several timer related issues (!781)
- Fix unresponsive back button when previewing a meeting (!755)
- Fix event creation start time is not initially in the future (!774)

### Stability Improvements

- make a resolution of json5 for some libraries (!785)

### New Features

- Add a Dialog to ask if the meeting information should be deleted (!776)
- render a list of users difference by suggested users, invited users and selected users (!775)

## 1.0.12

### UI/UX Fixes

- Fix the wrong percentage calculation of vote results (!767)
- Refine wordings (!764)
- Fix duration string for voting overview panel (!768)
- Improve Waiting Participant List and Item (!890)

### Stability Improvements

- Show session duration time in vote and poll; zero means unlimited time (!762)
- Add translations for poll states (!765)
- Moved hard-coded component color to the theme (!766)

### New Features

## 1.0.11

### UI/UX Fixes

- Hide blur button on safari browsers (!758)
- Fix space key switch also video on / off (!747)
- Add tooltip to the chat input filed when chat is disabled (!739)
- Fix visible background image on dashboard page (!745)
- Fix wrong start/end time in meeting overview (!723)
- Show only unmuted participants in mute-all-list (!736)
- Fix Send feedback without user interaction possible (!744)
- Fix naming and rendering of the protocol module (!740)
- Fix missing chat message timestamp (!742)
- Fix Guest requests to share his screen but moderator doesn't receive a notification (!743)
- Fix Event date format doesn't match input format
- Fix action buttons are overflowing user video thumbnail when sharing screen (!720)
- Fix stopwatch translation (!759)
- Add time information to details page (!746)

### Stability Improvements

- Add eslint-plugin-jsx-a11y package (!748)
- Fix missing key in moderation sidebar (!756)
- Conference room_error - Video channel broken (!761)
- Handle and communicate unexpected webRTC remote connection failures (!38)
- Fix Error when many participants left the room (!738)
- Fix meeting Accept/Decline buttons to not trigger details view (!741)
- Sync with backend API by removing unused event status fields (!737)
- Reimplement config error page (!731)
- Change whiteboard namespace to match backend update (!749)
- Update EE chat interface (!760)
- Removed unused search button from meeting list. (!753)

### New Features

- Sort users in the room by when they joined (!757)
- Add a button for the moderator to create an etherpad pdf (!751)
- Voting result overview table (!750)
- Anonymous voting (!754)
- Add asset table to details page (!752)
- Room recording (!682)

## 1.0.10

### UI/UX Fixes

- Fix incorrect remaining time on timer stop. (!715)
- Fix delete meeting leading to details page (!717)
- Fix create/update/details pages in meetings showing ID (!718)
- Fix missing translation on unregisted suggestion list (!733)
- Fix broken layout when viewing hotkey dialog list in German (!724)
- Fix black videos on iOS (!734)
- Fix timer displaying wrong format (!721)
- Fix allowed click when cursor is outside of the field (!732)

### Stability Improvements

- Fix SpeakerView video quality does not switch (!735)
- Refinement: Remove usage of an index as a key in Tabs (!729)
- Refinement: Password field ignores leading and trailing white-spaces (!728)
- Migrate timestamp format for incoming chat message (!730)

### New Features

- Feat: Delete global chat as moderator (!719)

## 1.0.9

### UI/UX Fixes

- Fix grant presenter role to guest users (!714)
- Fix invites on meeting overflow on long text (!713)
- Fix pending permission request causes flickering toolbar buttons (!709)
- Fix suggested participants had to be clicked twice in the dashboard (!708)
- Fix delayed language switch on dashboard. (!711)
- Fix wrong copy to clipboard notification message for password and dial-in fields (!712)

### Stability Improvements

- Refinement: Adhoc events are excluded on the dashboard. (!700)
- Refinement: Merged date and time pickers in the event creation. (!725)

### New Features

- Grant presenter role (!706)

## 1.0.8

### UI/UX Fixes

- Fix increase character limit for chat messages (!701)
- Fix TimePickers component anchoring (!695)
- Fix missing label on external invitee (!692)
- Reverse logic for time independent meeting switch (!703)
- Fix spelling error in de/echotest-warn-no-echo-cancellation (!704)
- Highlight moderator chat messages (!663)
- Fix mobile views for smartphone sizes (!702)
- Fix uniform naming for "waiting room" in German (!705)
- Fix Microsoft Edge browser support (!707)
- Fix TimePicker locale (!706)

### Stability Improvements

- Add common Error component (!689)
- Fix meet-now page to not generate new events on token refresh (!697)
- Fix invite link selection on event details page (!699)

### New Features

- Make 'change password' configurable (!698)
- Add shortcut keys overview list (!687)

## 1.0.7

### UI/UX Fixes

- Add tooltip to the moderation sidebar timer tab (!683)
- Fix wrong naming of features (!685)
- Change expired invite link message (!674)
- Fix not updating `DebugPanel` stats on participant leave (!676)
- Change the German wording from Breakout Rooms to Breakout-Räume (!667)
- Fix the German wording for breakout rooms (!668)
- Change beta tooltip text and view (!671)
- Fix browser regex for iPhones safari version (!677)
- Show configured error report email in message (!680)
- Fix screen share thumbnail to show the avatar when video is off (!686)
- Fix jumping clock. (!691)
- Fix echo cancelling message shown upon room leaving. (!693)
- Fix password message not visible in the lobby. (!688)

### Stability Improvements

- Change the variable name WHITEBOARD in README.md to FEATURE_WHITEBOARD (!666)
- Change structure for chat message interfaces (!679)
- Fix MeetingView's layout break when additional element is rendered (!675)
- Fix handling of the own user in the participants list (!681)
- Fix invite link not being used for logged in users (!690)
- Fix video resize handler (!694)

### New Features

- Add the moderator as first entry to the participant list of the breakout room (!670)
- Add feature for moderator to reset hand raises (!664)
- Add event details page (!639)
- Add accept/decline meeting buttons to details page (!652)
- Add feature for moderator to enable/disable hand raises (!665)
- Own screen share will be shown in the local video (!672)
- Add toggle for waiting room in create/update event (!678)
- Add feature for moderator to enable/disable chat (!684)
- Prevent reloading app on switching breakout rooms (!736)
- Add a badge on new participants in waiting room (!669)

## 1.0.6

### UI/UX Fixes

- hide all disabled moderator tabs (!651)
- Fix design issues with invite link dateTime picker (!655)
- Reverted missing TimerPopover in the meeting page. (!659)
- Fix SideToolbar Tab component prop (!656)
- Fix overflowing invitees layout. (!661)
- Fix layout bug in the common TextField

### Stability Improvements

- upgrade project dependencies and type fixes for typescript v4.8
- Fix invite link leading to error page (!600)
- Fix hotkeys not working (!658)
- Fix rrule crashing on unsupported timezone value (!653)

### New Features

- Add possibility for moderator to switch between breakout rooms (!709)
- Add Whiteboard (!647)
- Add debug panel (!620)
- Add joinWithoutMedia config flag (!650)
- Add an audio echo test to the Lobby (!654)
- Add chat filtering (!660)

## 1.0.5

### UI/UX Fixes

- Fix notifications in fullscreen (!515)
- Refactor MeetingCard related components and logic (!631)
- Fix grid view overflow (!641)
- Fix ICE notification suggesting the application is broken (!690)
- Remove speaker window transition (!645)

### Stability Improvements

- Set video stream quality based on size of video element (!643)
- Refactored routeHandling for the conference, waiting and lobby page.(!622)
- Extend connectionStatsSlice to store updates as array (!638)
- Fix remote video ref on unmount (!629)

### New Features

- Add Safari support (!635)
- Add a config option to limit the bandwidth for video/screen sharing (!642)
- Fix video off-setting should not switch off screen-share (!644)
- Add decline meeting functionality to MeetingPopover (!631)

## 1.0.4

### UI/UX Fixes

- Fix the error on opening invite link as logged on user (!628)

### Stability Improvements

- Fix racy media subscription due to early publish_complete announcements (!632)
- Fix publisher stats being updated in the stats slice (!630)
- Fix Auth provider keeps sending token renewal requests (!619)
- Fix console warnings (!634)

### New Features

- Add full_trickle support to speed up WebRTC connection establishment (!618)
- Add hotkey bindings (!624)
- Add breakout rooms participants list (!623)

## 1.0.3

### UI/UX Fixes

- Fix the missing stopping of the camera and screen share (!601)
- Add waiting room message into join button (!612)
- Fix toolbar popup in fullscreen mode (!610)
- Fix StartMeeting animation (!609)
- Fix console warning for TextInput and select field (!370)
- Fix DurationField's label not visible (!604)

### Stability Improvements

- Implement a popover menu where the user can see all votes/polls (!589)
- Fix add missing fields to the configuration in setupTests.ts (!656)
- Update the RTK query rooms API (!616)
- Add error handling for failing ICE (!608)
- Change fullscreen implementation (!606)
- Add feature-toggles in config and entrypoint (!614)

### New Features

- Add character-counter to TextFields (!567)
- Add a timer function (!604)

## 1.0.2

### UI/UX Fixes

- Fix SpeedTest button disappears (!574)
- Fix hangup in fullscreen mode for creator/moderator (!579)
- Fix german invitees language (!576)
- Fix SpeakerView not resizing properly (!575)
- Add delete room just for the creator (!572)
- Fix raiseHand button icon. (!583)
- Fix copy button message to the correct translation key. (!580)
- Fix dashboard header in mobile view for event editing. (!578)
- Change main logo to have a white gradient (!589)
- Fix delete-event-dialog (!588)
- Fix poll wrong title (!571)
- Fix close button in poll/vote result positioning broken (!571)
- Add toggle option for sorting by groups in participants list (!582)
- Fix speed test button (safari) (!584)
- Fix timePicker focused style (!592)
- Improve handling of video background effects (!605)

### Stability Improvements

- Fix inconsistent path usage (!570)
- Set dashboard language selection field default (!569)
- Fix MUI fragment error (!573)
- Polish protocol module (!517)
- Prevent race condition error while switching audio and video buttons on Safari (!565)
- Fix logout url parameter (!577)
- Fix sound device selection dropdown for Chrome (!533)
- Remove unused roboto font. (!585)
- Fix parameter initialization for Libravatar. (!594)
- Fix recurrence pattern (!587)
- Fix EventsSlice's events having a racy key (!602)
- Disable video effects in Safari (!598)
- Fix error due to empty id_token and racy login call (!591)
- Add check for audioContext support (!590)

### New features

- Add waiting room feature (!484)

## 1.0.1

### UI/UX Fixes

- Fix position for video overlay icons (!559)
- Fix endless loading loop on user-me fail (!544)
- Fix breakout rooms random distribution (!539)
- Hide edit & delete buttons in more menu for non event creator (!562)
- Fix latency line disappearing (!563)
- Fix background images section showing when empty (!564)
- Add redirect after deleting conference (!568)

### Stability Improvements

- Fix beta release flag config (!558)
- Prevent poll from crashing (!560)
- Check for token refresh error and display Login error page (!546)

### New Features

- Add email field to suggested and invited participants in invite to MeetingPage (!561)
- Grant & revoke moderation rights (!545)
- Add feature for inviting unregistered users (!566)

## 1.0.0
