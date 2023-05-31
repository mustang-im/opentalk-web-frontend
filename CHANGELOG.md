## Unreleased

### UI/UX Fixes

- Fix: Safari user is not redirect to lobby page after remove participant action (!920)
- Rework of dashboard meeting overview (!968)
- Fix: Legal vote token not being completely visible (!967)
- Fix: Legal vote results are not visible to every participant (!967)
- Fix handling when time limit quota is elapsed (!974)
- Fix chat indicator related issues (!975)
- Change wording and add link to recording stopped notification (!969)

### Stability Improvements

- Fix crash on leaving conference after switching between chats (!975)
- Fix: Correct the handling media and connection change events (!976)
- Add aria labels to cam/mic option buttons (!972)

### New Features

## 1.5.x

### UI/UX Fixes

- Fix: new message dialog tab order (!965)
- Fix: automatically open talking stick tab for moderator on start (!960)
- Fix: make clear search button focusable with tab key (!961)
- Add translated labels to emoji and send button (!959)

- Disable time limit notifications in the lobby (!955)
- Fix time limit notification for guests joined at the end (!955)

### Stability Improvements

- Remove redux from the dependencies (!962)

### New Features

- Add shared folder icon button to the meeting header (!943)
- Add shared folder setup to the dashboard (!947)
- Introduced Automod feature called the "Talking Stick" (!912)
- Implement dynamic media subscriptions management (!942)
- Fix emoji picker popover cutoff on small devices (!952)
- Add missing dropdown labels on the view filter (!951)

### Stability Improvements

- Secure connection information is more eye-catching for the user (!949)

## 1.4.x

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
