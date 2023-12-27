<#--
SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>

SPDX-License-Identifier: EUPL-1.2
-->

messages = Messages
dismiss = Dismiss
title-filename = Filename
state-created = Created
title-actions = Actions
action-delete = Delete
action-download = Download
global-calendar-week = CW

error-fetch-4xx = error loading resource
error-general = Ups, something went wrong. Please try again.
error-invite-link = This invite-link is not active anymore.
signaling-subscription-failed = The connection to a participant failed.
media-subscription-failed = No connection to the participant

error-system-currently-unavailable = The system is currently unavailable, please try again later.
error-unauthorized = Unfortunately you do not have access, please contact the meeting moderator.

login-form-title = Login
login-form-body = Please log in to continue.
login-form-body-loading = Login is in progress
login-form-button-submit = Login

route-not-found = Route not found
room = Room {$roomNumber}
joinform-title = Enter Conference
joinform-enter-name = Please enter your name
joinform-enter-now = Enter now
joinform-enter-password = Password
joinform-waiting-room-enter = Waiting active - please wait...
joinform-wrong-room-password = The password you entered is incorrect.
joinform-access-denied = Access denied: You were not invited to this meeting.
field-error-required ="{$fieldName}" is a required field
joinform-banned-from-room = You were banned from this meeting.
joinform-room-not-found = Room not found.
joinform-display-name-field-disabled-tooltip = Editing disabled according to organisational policy.
joinform-room-title = OpenTalk Meeting Invitation - "{$title}"

room-loading-setup = <title>Configuring connection...</title>
room-loading-starting = <title>Connecting to room...</title>
room-loading-reconnect = <title>Reconnecting to room...</title>
room-loading-generic = <title>Loading room...</title>
room-loading-blocked = <title>The maximum number of participants has been reached</title><bodyText>If a position in the room becomes available, we will connect you automatically.<br /> Please wait or contact the moderator.</bodyText>

http-error-message-400 = Can't create or modify the room, please try again
http-error-message-401 = You are not authorized for this action
http-error-message-403 = This action is forbidden
http-error-message-404 = We couldn't find requested room
http-error-message-500 = Network / Server not available at this moment. Please, try again later
http-error-message-password = Password don't match
http-error-message-credentials = Provided credentials are incorrect
http-error-message-no-breakout-room = Breakout room does not exist

auth-popup-closes-message = This popup will close automatically.
auth-redirect-message = You will be redirected shortly.
copy-url-to-clipboard = copy URL to clipboard
toggle-password-visibility = toggle password visibility

echotest-warn-no-echo-cancellation = Your Browser does not support echo canceling. Please use headphones to avoid audio feedback.
audiomenu-choose-input = Choose audio input device
videomenu-choose-input = Choose video input device
devicemenu-wait-for-permission = Waiting for device permission
device-permission-denied = Device permission denied. Please review your page settings.
quality-cap-setting = Quality Cap
quality-audio-only = Off
quality-low = Low
quality-medium = Medium
quality-high = High
videomenu-settings = Settings
videomenu-blur-on = Background filter on
videomenu-blur-off = Background filter off
videomenu-mirroring-on = Own video mirroring on
videomenu-mirroring-off = Own video mirroring off
videomenu-background = Background
videomenu-background-images = Background images
videomenu-background-no-image = No background image
remotevideo-no-stream = no video stream
localvideo-no-device = no video device found

participant-stream-broken-tooltip = Mediastream broken
participant-audio-broken-tooltip = Audio channel broken
participant-video-broken-tooltip = Video channel broken
participant-stream-disconnected = Participant connection broken
participant-stream-failed = Participant connection failed

media-denied-warning =
    You canceled or denied access to { $mediaType ->
        [video] the camera
        [audio] the microphone
        [screen] screen sharing
        *[unknown] the device
    }.
    Please review the permission settings near the address bar if you intend to share still.

media-access-error =
    Failed to access { $mediaType ->
        [video] the camera
        [audio] the microphone
        [screen] screen sharing
        *[unknown] the device
    }.
    Please check whether it is already used by another application.

media-ice-connection-not-possible = It was not possible to establish a connection with other participants. Please check your internet connection and firewall. If the problem persists, please contact your administrator.

input-search-placehoder = Search...
chatbar-send-message = Send
chatbar-input-placehoder = Type your message
chatbar-unknown-username = unknown

chat-private-scope = Send Private
chat-group-scope = Group
chat-global-scope = Room
chat-error-invalid-group-selection = The group addressed by this message is not available.
chat-error-invalid-participant-selection = The user addressed by this message is not online anymore.
chat-new-private-message = You have a new message
chat-new-group-message = You have a new message
chat-message-error-max-input = The message is too long (max {$maxCharacters} chars)
event_chat = Event Chat
chatinput-placeholder = type a message...
chat-input-error-required = Empty messages are not allowed
chat-no-search-results = No messages matching the criteria
chat-search-reset = Reset
chat-delete-global-messages-success = The global chat has been deleted by the moderator.
chat-open-emoji-picker = open emoji picker
chat-close-emoji-picker = close emoji picker
chat-submit-button = submit chat message
chat-smiley-label = smiling face emoji

no-group-participants-label = without group
button-back-messages = Back
participant-menu-send-message = Send direct message
participant-menu-remove-participant = Remove participant
participant-menu-grant-moderator = Grant moderator right
participant-menu-revoke-moderator = Revoke moderator right
participant-menu-accept-participant = Accept participant
participant-menu-accepted-participant = Accepted participant
button-new-message = New Message
empty-messages = You have no messages at the moment. Create one to start a private conversation with a person or a group.
encrypted-messages = This is the beginning of your chat history. Nobody has access the content of your chat except the people inside the chat.

moderation-rights-granted = You have been granted moderation rights.
moderation-rights-revoked = Your moderation rights have been revoked.

sort-label = Order
sort-by = Sort by
sort-groups-on = Group filter on
sort-groups-off = Group filter off
sort-name-asc = Name (A - Z)
sort-name-dsc = Name (Z - A)
sort-first-join = First Join Time
sort-last-join = Last Join Time
sort-last-active = Last Active
sort-raised-hand = Raised Hand First
sort-random = Random

grant-presenter-role = Grant presenter role
revoke-presenter-role = Revoke presenter role

menutabs-chat = Chat
menutabs-people = People
menutabs-messages = Messages

guest-label = Guest

# $roomName (String) - Breakout Room Name.
# $timeInSeconds (Number) - The duration in seconds.
# $numberOfOtherRooms (number) - Number of other rooms.
breakout-notification-members-in-breakout-room = Participants in Breakout Room {$roomName}
breakout-notification-new-session-header = Breakout Session Started
breakout-notification-new-session-cta = A Breakout Session started. Please join a room. You got {$timeInSeconds ->
    [one] one second
   *[other] {$timeInSeconds} seconds
} until you will be assigned a random one.
breakout-notification-new-session-button = Join Breakout Room {$roomName}
breakout-notification-joined-breakout-room-header = Breakout Room Joined
breakout-notification-joined-breakout-room-body = You joined breakout room {$roomName}
breakout-notification-joined-session-header = Breakout Session Active
breakout-notification-joined-session-cta = You joined a conference, where currently a breakout session is active. Please switch into an appropriate room. Currently the following other {$numberOfOtherRooms ->
    [one] room is
   *[other] {$numberOfOtherRooms} rooms are
} accessible:
breakout-notification-joined-session-button = Switch to Room {$roomName}
breakout-notification-session-ended-header = Breakout Session Ended
breakout-notification-session-ended-cta = The Breakout Session you were part of ended. Please return to the main conference. You got {$timeInSeconds} seconds before you will be moved automatically.

toolbar-button-audio-turn-on-tooltip-title = Turn On Audio
toolbar-button-audio-turn-off-tooltip-title = Turn Off Audio
toolbar-button-audio-context-title = additional options microphone
toolbar-button-video-turn-on-tooltip-title = Turn On Video
toolbar-button-video-turn-off-tooltip-title = Turn Off Video
toolbar-button-video-context-title = additional options camera
toolbar-button-raise-hand-tooltip-title = Raise Your Hand
toolbar-button-lower-hand-tooltip-title = Lower Your Hand
toolbar-button-handraises-disabled = Handraises were disabled by the moderator
toolbar-button-blur-turn-on-tooltip-title = Turn On Background Blur
toolbar-button-blur-turn-off-tooltip-title = Turn Off Background Blur
toolbar-button-more-tooltip-title = More Options
toolbar-button-screen-share-turn-on-tooltip-title = Turn On Screen Share
toolbar-button-screen-share-turn-off-tooltip-title = Turn Off Screen Share
toolbar-button-end-call-tooltip-title = Leave Call

toolbar-button-screen-share-tooltip-request-moderator-presenter-role = Ask a moderator to allow to share your screen

toolbar-aria-label = Personal control panel

more-menu-leave-call = Leave Call
more-menu-create-invite = Invite guest
more-menu-start-recording = Start recording
more-menu-stop-recording = Stop recording

more-menu-enable-waiting-room = Enable waiting room
more-menu-disable-waiting-room = Disable waiting room
more-menu-turn-handraises-on = Enable handraises
more-menu-turn-handraises-off = Disable handraises
more-menu-keyboard-shortcuts = Keyboard Shortcuts
more-menu-delete-global-chat = Clean global chat
waiting-room-enabled-message = Waiting room is enabled
waiting-room-disabled-message = Waiting room is disabled
more-menu-enable-chat = Enable chat
more-menu-disable-chat = Disable chat
more-menu-moderator-aria-label = Open menu for more options
chat-enabled-message = Chat was enabled by moderator
chat-disabled-message = Chat was disabled by moderator
chat-disabled-tooltip = The Chat is deactivated by the moderator

turn-handraises-off-notification = Handraises were disabled by the moderator
turn-handraises-on-notification = Handraises were enabled by the moderator

waiting-room-participant-label = Waiting room

in-waiting-room = You are currently in the waiting room
in-waiting-room-ready = You are enabled to join the room

approve-all-participants-from-waiting = Approve all

moderationbar-button-home-tooltip = Home
moderationbar-button-mute-tooltip = Mute participants
moderationbar-button-add-user-tooltip = Add User feature is under development
moderationbar-button-breakout-tooltip = Create Breakout Rooms
moderationbar-button-poll-tooltip = Poll
moderationbar-button-ballot-tooltip = Voting
moderationbar-button-wollknaul-tooltip = Wollknaul feature is under development
moderationbar-button-timer-tooltip = Timer
moderationbar-button-coffee-break-tooltip = Coffee break
moderationbar-button-speaker-queue-tooltip = This feature is under development - OpenTalk can keep track of speaking times, even if there are many participants in a session, and automatically call everyone in turn to contribute. While one participant is still speaking, the next speaker will receive a visual indication that they are up next. Helping you to conduct meetings efficiently without confusion - that's OpenTalk.
moderationbar-button-wheel-tooltip = This feature is under development - Who is up next? With our "Wheel of names", you can leave it to chance to decide. A fun feature that can introduce excitement and entertainment in the classroom. But the wheel of names can do more: If the objective is that no one is to be left out of the conversation, the wheel can ensure that those who have already spoken will not be called up again.
moderationbar-button-protocol-tooltip = Protocol
moderationbar-button-whiteboard-tooltip = Whiteboard
moderationbar-button-reset-handraises-tooltip = Reset raised hands
moderationbar-button-debriefing = Debriefing
moderationbar-button-talking-stick-tooltip = Talking stick
moderationbar-aria-label = Moderation sidebar

mute-participants-tab-title = Mute participants
mute-participants-button-all = All
mute-participants-button-selected = Selected

talking-stick-tab-title = Talking stick
talking-stick-skip-speaker = Skip speaker
talking-stick-participant-amount-notification = Note: We recommend to use the Talking Stick with minimum of 3 people.
talking-stick-started-first-line = The Talking Stick is started.
talking-stick-started-second-line = Participant list equals speaker list.
talking-stick-finished = The Talking Stick is finished.
talking-stick-next-announcement = You are next.
talking-stick-speaker-announcement = It's your turn now. Please turn on the microphone!
talking-stick-notification-unmute = Unmute
talking-stick-notification-next-speaker = Next speaker
talking-stick-unmuted-notification = You are unmuted. When you're done, please pass the talking stick to the next speaker.
talking-stick-unmuted-notification-last-participant = You are unmuted. You are the last person, when you're done, please hand over the talking stick.

reset-handraises-tab-title = Reset raised hands
reset-handraises-button = All
reset-handraises-notification = All raised hands were reset by the moderator

debriefing-tab-title = Debriefing
debriefing-button-all = End of the conference
debriefing-moderator-section-title = End conference and start debriefing
debriefing-button-moderators = For moderator
debriefing-button-moderators-and-users = For moderator + registered user
debriefing-started-notification = Debriefing initiated - Waiting room is activated.
debriefing-session-ended-notification = The conference was closed by the moderator.
debriefing-session-ended-for-all-notification = The conference is ended for all.

media-received-request-mute-ok = Mute
media-received-force-mute = You were muted by {$origin}.
media-received-request-mute = {$origin} requested to mute your self.

dialog-invite-guest-title = Invite guest
dialog-invite-guest-expiration-date = Expiration date
dialog-invite-guest-no-expiration = No expiration date
dialog-invite-guest-expiration-date-error = Expiration date must be at least 5 minutes from current time
dialog-invite-guest-button-copy = Copy to Clipboard
dialog-invite-guest-button-submit = Create

statistics-video = video resolution
statistics-fps = frame rate
statistics-rate = bit rate
statistics-jitter = jitter
statistics-packets-lost = packet loss
statistics-decode-time = decoding time
statistics-latency = latency
statistics-local-network-endpoint = local endpoint
statistics-remote-network-endpoint = remote endpoint
statistics-value-redacted = (redacted)

slotmachine-label = Wheel Of Names
slotmachine-pre-message = Lottery has
slotmachine-post-message = participants
font-awesome-license = Font Awesome Licence

legal-vote-tab-title = Voting
legal-vote-header-title-create = Create voting
legal-vote-header-title-update = Update voting
legal-vote-button-back = back
legal-vote-overview-saved-legal-votes = saved votings
legal-vote-overview-created-legal-votes = created voting
legal-vote-canceled = Voting is canceled
legal-vote-stopped = Voting is stopped
legal-vote-error = Your vote could not be evaluated, an error has occurred
legal-vote-active-error = A vote is already running.

legal-vote-form-input-error-number = Only enter numbers
legal-vote-form-input-error-max = Maximum number of allowed characters is {$maxCharacters}
legal-vote-input-name-placeholder = Title
legal-vote-input-subtitle-placeholder = Subtitle
legal-vote-input-topic-placeholder = Topic
legal-vote-input-title-required = Title required
legal-vote-input-subtitle-required = Subtitle required
legal-vote-input-topic-required = Topic required
legal-vote-input-assignments-required = Min 2 participants must be assigned

legal-vote-popover-results-button = Show voting results

legal-vote-overview-button-create-vote = Create new voting
legal-vote-form-button-save = Save
legal-vote-form-button-continue = Continue

legal-vote-overview-panel-button-cancel = Abort
legal-vote-overview-panel-button-end = Close
legal-vote-overview-panel-status-active = Active
legal-vote-overview-panel-status-finished = Finished
legal-vote-overview-panel-status-canceled = Canceled
legal-vote-select-participants-title = Select participants

legal-vote-form-duration = duration
legal-vote-form-duration-unlimited = unlimited
legal-vote-form-allow-abstain = allow abstaining
legal-vote-form-auto-stop = auto close
legal-vote-form-hidden-voting = secret voting
legal-vote-form-auto-stop-tooltip = Activate or deactivate automatic exit once all votes have been cast

legal-vote-yes-label = Approval
legal-vote-no-label = Disapproval
legal-vote-abstain-label = Abstention

legal-vote-no-results = No votes placed

legal-vote-form-kind = Voting Type
legal-vote-roll_call = Roll Call
legal-vote-live_roll_call = Roll Call - by name
legal-vote-pseudonymous = Hidden Vote

legal-vote-success-clipboard-message = You voted {{vote}}
legal-vote-token-copy-success = The token was copied to your clipboard

legal-vote-share-token-active = The token will be displayed here after the end of vote.
legal-vote-share-token-inactive = Do not share this token with others and keep it in a safe place!

poll-participant-list-button-select = Select
poll-participant-list-button-close = Close
poll-participant-list-button-save = Save
poll-participant-list-button-start = Start vote
poll-participant-list-button-select-all = Select all

legal-vote-success = Your vote was counted successfully at {{atVoteTime}} on {{onVoteDate}} using the following confirmation token.
It can later be used to confirm the correctness of the voting result.
legal-vote-not-selected = You have not been selected to participate in this vote.
legal-vote-save-form-success = Your vote form was saved successfully
legal-vote-save-form-error = Saving failed, you need to specify a topic and a name

no-votes-in-conference = There are no votes for this conference at the moment.

breakout-room-tab-title = Create Breakout Rooms
breakout-room-form-field-rooms = number of rooms
breakout-room-form-field-participants-per-room = participants per room
breakout-room-form-field-random-distribution = random distribution
breakout-room-form-field-include-moderators = include moderators

breakout-room-form-error-min-room = too few rooms
breakout-room-form-error-max-room = too many rooms
breakout-room-form-error-min-participants = too few participants
breakout-room-form-error-max-participants = too many participants
breakout-room-form-error-expanded = please, open a menu

breakout-room-tab-by-rooms = By No. of Rooms
breakout-room-tab-by-participants = By No. of Participants
breakout-room-tab-by-groups = By Groups
breakout-room-tab-by-moderators = By No. of Moderators
breakout-room-create-button = Create Rooms
breakout-room-create-button-disabled = Insufficient number of participants present in the conference

breakout-room-rooms-created-by-participants = Create {$rooms} Rooms
breakout-room-assignable-participants-per-rooms = Assign {$participantsPerRoom} participants per room

field-duration-unlimited-time = Unlimited Time
field-duration-button-text = Session Duration
field-duration-button-close = Close
field-duration-button-save = Save
field-duration-custom = Custom
field-duration-input-label = Enter custom duration (min)

user-selection-button-back = back
user-selection-button-cancel = Cancel
user-selection-button-save = Save
user-selection-error-invalid-room-assignments = the amount of user per room is invalid
user-selection-not-assigned-users = not assigned participants
user-selection-assigned-users = assigned to room

user-editor-button-edit = Edit

breakout-room-notification-started = BreakoutRoom started
breakout-room-notification-stopped = BreakoutRoom stopped
breakout-room-notification-joining-closed-room = BreakoutRoom is closed, you get routed to the main room
breakout-room-notification-button-join = Join Room
breakout-room-notification-button-leave = Leave Room

breakout-room-room-overview-button-close = Close Room
breakout-room-room-overview-title = Breakout Rooms
breakout-room-room-overview-no-duration = no duration
breakout-room-room-overview-participant-list = Participants in Breakout Rooms

breakout-room-room-overview-participant-list-me = (me)

moderator-join-breakout-room = Join room
fallback-room-title = Meeting room

secure-connection-message = This connection is encrypted and safe.

participant-joined-text = Joined {$joinedTime}
participant-hand-raise-text = Hand raised {$handUpdated}
participant-last-active-text = Last Active {$lastActive}
participant-joined-event = joined the call at {$time}
participant-left-event = left the call at {$time}

poll-overview-button-create-poll = Create new poll
poll-tab-title = Polls
no-polls-in-conference = There are no polls for this conference at the moment.
poll-form-button-submit = Start poll
poll-form-button-save = Save
poll-header-title-update = Update poll
poll-header-title-create = Create poll
poll-save-form-success = Poll saved successfully
poll-button-back = back
poll-form-switch-live = Live
poll-form-switch-live-tooltip = Follow the poll live or wait until the end to announce the result
poll-input-topic-placeholder = Topic
poll-input-choices = Add Answer
poll-form-input-error-max = Max {$max} characters
poll-form-input-required = Required field
poll-form-input-error-number = Only enter numbers
poll-form-input-error-choices = Minimal created answers are 2
poll-form-input-error-choice = Empty choices are not allowed
poll-save-form-success = Your poll was saved successfully
poll-save-form-error = The poll for saving must include a topic
poll-save-form-warning = Minimum of 2 participants is required to start a poll
poll-overview-saved-legal-votes = saved Polls
poll-overview-created-legal-votes = created Polls
poll-overview-panel-button-end = End Poll
poll-overview-panel-status-active = Active
poll-overview-panel-status-finished = Finished

timer-tab-title = Timer
timer-form-button-submit = Create Timer
timer-form-ready-to-continue = Ask participants if they are ready
timer-counter-remaining-time = Remaining time
timer-counter-elapsed-time = Elapsed time
timer-overview-button-stop = Stop timer
timer-notification-stopped = The timer was stopped
timer-notification-ran-out = The timer ran out
timer-notification-error = There was an issue with the start time
timer-popover-title = A timer was started
timer-popover-button-done = Mark me as done
timer-popover-button-not-done = Unmark me as done

coffee-break-title-counter = Duration
coffee-break-tab-title = Coffee break
coffee-break-form-button-submit = Start coffee break
coffee-break-layer-not-running = Coffee break is over
coffee-break-layer-button = Back to the conference
coffee-break-layer-title = Coffee break! Time left:
coffee-break-popover-title = Coffee break ...
coffee-break-notification = The coffee break is over.
coffee-break-stopped-title = Coffee break is over.
coffee-break-overview-button-stop = Stop coffee break

speed-meter-init-message = Initialising ...
speed-meter-started-message = Please wait.\nThe test will take up to 20 seconds.
speed-meter-error-message = An error occurred.
speed-meter-stable-message = Your internet connection is stable.\nYou can join the call without any limitations.
speed-meter-slow-message = Your internet connection is slow.\nYou can join the call with some limitations.
speed-meter-latency-label = Latency
speed-meter-restart-button = Start Speed-Test
speed-meter-button = Start Speed-Test
speed-meter-title = Speed-Test
speed-meter-mbps = Mb/s
speed-meter-ms = ms
speed-meter-upload-label = Upload
speed-meter-download-label = Download

indicator-has-audio-off = {$participantName} has the mic off
indicator-has-audio-on = {$participantName} has the mic on
indicator-has-raised-hand = {$participantName} wants to say something
indicator-pinned = {$participantName} is pinned
indicator-fullscreen-open = open fullscreen
indicator-fullscreen-close = close fullscreen
indicator-change-position = change position

wrong-browser-dialog-title = Your browser is only partially supported.
wrong-browser-dialog-message = Please use the latest version of Chrome, Firefox or Safari. If you have further difficulties, check whether your browser is running in compatibility or incognito mode. Disable them and try again here.
wrong-browser-dialog-ok = Ok

safari-warning-notification = OpenTalk isn't fully optimized for Safari, yet. We recommend you use Chrome, Brave, Edge, or Firefox instead.

error-config-title = Incorrect Configuration
error-config-message = Failed to load an correct configuration. Please, contact your administrator.
error-system-unavailable = The system is currently unavailable, please try again later.

error-session-expired = Session Expired
error-session-expired-message = Login session has expired, if you want to continue using this app, please login again

error-oidc-configuration = Incorrect OIDC configuration
error-oidc-configuration-message = Failed to load correct OIDC configuration. Please, contact your administrator.

asset-download-error = Unable to download asset.
asset-delete-error = Unable to delete asset.

no-favorite-meetings = You don't have any favorites yet.

selftest-header = Say hello to yourself.
selftest-body = You might want to turn on your camera and microphone here and test it.
selftest-body-do-test = Camera and microphone can be tested here.
dashboard-home-join = Start
dashboard-home-created-by = Created by {$author}
global-state-active = active
global-state-finished = finished
global-state-canceled = canceled
global-accept = Accept
global-cancel = Cancel
global-decline = Decline
global-stop = Stop
global-favorite = Marked as favorite
global-invite = Invitation
global-month = Month
global-day = Day
global-week = Week
global-participants = Participants
global-meeting = Meeting
global-save = Save
global-save-changes = Save changes
global-password = Password
global-beta = Beta
global-me = Me
global-create-link-success = The link was created successfully
global-copy-link-success = The link was copied to your clipboard
global-copy-permanent-guest-link-error = No permanent guest link for this meeting has been created yet! Please, open the "Participants" section of this meeting and copy guest link from there.
global-password-link-success = The password was copied to your clipboard
global-dial-in-link-success = The telephone dial-in was copied to the clipboard
global-textfield-max-characters = {$remainingCharacters} characters remaining
global-textfield-max-characters-error = {$remainingCharacters} characters too many
global-duration = Duration
global-title = Title
global-on = On
global-off = Off
global-microphone = Microphone
global-video = Video
global-description = Description
global-fullscreen = Fullscreen
global-shortcut = Shortcut
global-space = space
global-anonymous = Anonymous
global-start-now = Start now
global-clear = Clear
global-open = Open
global-close = Close
global-ok = Ok
global-no-result = No result

dashboard-home = Home
dashboard-meetings = Meetings
dashboard-meetings-create = Create meeting
dashboard-meetings-update = Update meeting
dashboard-statistics = Statistics
dashboard-recordings = Recordings
dashboard-settings = Settings
dashboard-my-profile = My Profile
dashboard-settings-general = General
dashboard-settings-account = Account
dashboard-settings-profile = Profile
dashboard-settings-video = Video
dashboard-settings-audio = Audio
dashboard-settings-accessibility = Accessibility
dashboard-settings-logout = Logout
dashboard-account-management = Account management
dashboard-legal = Legal
dashboard-legal-imprint = Imprint
dashboard-legal-data-protection = Data protection
dashboard-help = Help
dashboard-help-documentation = Documentation
dashboard-help-support = Support

dashboard-quick-start-title = OpenTalk Dashboard Quick Guide
conference-quick-start-title = OpenTalk Conference Quick Guide
conference-quick-start-open = Open quick guide
conference-quick-start-close = Close quick guide

quick-start-loading = Loading the quick guide
quick-start-error = Couldn't load the quick guide

dashboard-faq = FAQ
dashboard-close-navbar = Close navigation
dashboard-open-navbar = Open navigation
dashboard-join-meeting = Join the meeting

dashboard-settings-general-notification-save-success = Your settings have been saved successfully.
dashboard-settings-general-notification-save-error = Your settings couln't be saved.
dashboard-settings-general-language = Language
dashboard-settings-general-appearance = Appearance
dashboard-settings-general-notifications = Notifications
dashboard-settings-general-theme-light = Light
dashboard-settings-general-theme-dark = Dark
dashboard-settings-general-theme-system = System Default
dashboard-settings-profile-picture = Profile Picture
dashboard-settings-profile-name = Profile Name
dashboard-settings-profile-input-hint = Enter a name (such as your first name, full name, or a nickname) that will be visible to others on OpenTalk.
dashboard-settings-profile-button-save = Save
dashboard-settings-profile-input-required = The field cannot be empty

dashboard-meeting-card-error = Error detecting the meeting duration
dashboard-meeting-card-all-day = All-day
dashboard-meeting-card-timeindependent = Time-independent
dashboard-meeting-card-button-start-direct = Start direct meeting
dashboard-meeting-card-title-favorite-meetings = My favorite meetings
dashboard-meeting-card-title-next-meetings = Current meetings
dashboard-plan-new-meeting = Plan new meeting

dashboard-settings-account-title = General Information
dashboard-settings-account-email-label = E-Mail Address
dashboard-settings-account-firstname-label = First Name
dashboard-settings-account-familyname-label = Family Name
dashboard-settings-account-customerid-label = Customer-ID
dashboard-settings-account-change-password-button = Change Password

dashboard-meeting-card-popover-update = Edit
dashboard-meeting-card-popover-add = Add to favorites
dashboard-meeting-card-popover-remove = Remove from favorites
dashboard-meeting-card-popover-delete = Delete
dashboard-meeting-card-popover-details = Details
dashboard-meeting-card-popover-copy-link = Copy Meeting-Link
dashboard-meeting-card-popover-copy-guest-link = Copy Guest-Link

dashboard-meeting-card-delete-dialog-title = Please confirm
dashboard-meeting-card-delete-dialog-message = Do you really want to delete the meeting {$subject} ?
dashboard-meeting-card-delete-dialog-ok = Delete
dashboard-meeting-card-delete-dialog-cancel = Cancel

dashboard-create-meeting-dialog-title = Please confirm
dashboard-create-meeting-dialog-message = You already have a meeting scheduled for this time: <eventTitle>{$eventTitle} <eventTime>{$eventTime}</eventTime></eventTitle> Are you sure you want to create a new one?
dashboard-update-meeting-dialog-message = You already have a meeting scheduled for this time: <eventTitle>{$eventTitle} <eventTime>{$eventTime}</eventTime></eventTitle> Are you sure you want to update?
dashboard-create-meeting-dialog-ok = Create
dashboard-update-meeting-dialog-ok = Update
dashboard-create-meeting-dialog-cancel = Cancel

dashboard-direct-meeting-title = Who do you want to invite to your meeting?
dashboard-direct-meeting-label-select-participants = Invite participants - A maximum of {maxParticipants} participants are admitted to the meeting, incl. you as moderator.
dashboard-direct-meeting-label-select-participants-fallback = Invite participants
dashboard-direct-meeting-button-cancel = Cancel
dashboard-direct-meeting-button-open-room = Open Video Room
dashboard-direct-meeting-button-send-invitations = Send Invitations
dashboard-direct-meeting-invitations-successful = All the people you added have been successfully invited to your meeting.
dashboard-direct-meeting-invitations-error = There was a problem sending one or more invitations. Please try again later.
dashboard-direct-meeting-password-label = Password - optional
dashboard-direct-meeting-password-placeholder = Please define a meeting password

dashboard-invite-to-meeting-room-link-label = Meeting-Link
dashboard-invite-to-meeting-copy-room-link-aria-label = Copy Room link
dashboard-invite-to-meeting-copy-room-link-success = The link was copied to your clipboard
dashboard-invite-to-meeting-room-link-tooltip = Only for registered users
dashboard-invite-to-meeting-sip-link-label = Phone Dial-in
dashboard-invite-to-meeting-copy-sip-link-aria-label = Copy Sip link
dashboard-invite-to-meeting-copy-sip-link-success = The telephone dial-in was copied to your clipboard
dashboard-invite-to-meeting-guest-link-label = Guest-Link
dashboard-invite-to-meeting-copy-guest-link-aria-label = Copy Room link for guests
dashboard-invite-to-meeting-copy-guest-link-success = The link was copied to your clipboard
dashboard-invite-to-meeting-guest-link-tooltip = For guests without an account
dashboard-invite-to-meeting-room-password-label = Password
dashboard-invite-to-meeting-copy-room-password-aria-label = Copy Room password
dashboard-invite-to-meeting-copy-room-password-success = The password was copied to your clipboard
dashboard-invite-to-meeting-room-password-tooltip = Room password
dashboard-invite-to-meeting-shared-folder-link-label = Shared folder
dashboard-invite-to-meeting-copy-shared-folder-link-aria-label = Copy shared folder link
dashboard-invite-to-meeting-copy-shared-folder-link-success = The link was copied to your clipboard
dashboard-invite-to-meeting-shared-folder-password-label =  Folder password - For moderator ( with write permissions )
dashboard-invite-to-meeting-copy-shared-folder-password-aria-label = Copy shared folder password
dashboard-invite-to-meeting-copy-shared-folder-password-success = The password was copied to your clipboard
dashboard-invite-to-meeting-livestream-link-label = Livestream-Link
dashboard-invite-to-meeting-copy-livestream-link-aria-label = Copy livestream link
dashboard-invite-to-meeting-copy-livestream-link-success = The link was copied to your clipboard

dashboard-select-participants-textfield-placeholder = Type name or email address ( min. 3 characters )
dashboard-select-participants-label-added = Added
dashboard-select-participants-label-suggestions = Suggestions
dashboard-select-participants-label-search = Find participants
dashboard-event-time-independent-meetings = Unscheduled Meetings
dashboard-meeting-card-time-independent = Unscheduled
dashboard-events-my-meetings = My Meetings
dashboard-events-filter-by-invites = Only show invites
dashboard-events-filter-by-favorites = Only show favorites
dashboard-events-search = Search
dashboard-events-note-limited-view = Note: You have recurring meetings in your list, therefore we have limited the temporal view.
dashboard-adhoc-meeting-attention = Attention: This is an adhoc meeting, it will be automatically deleted after 24h and not shown in the dashboard.

dashbooard-event-accept-invitation-notification = Invite accepted for meeting {meetingTitle}
dashbooard-event-decline-invitation-notification = Invite declined for meeting {meetingTitle}

dashboard-meeting-textfield-title = Title
dashboard-meeting-textfield-title-placeholder = My new Meeting
dashboard-meeting-textfield-details = Details - optional
dashboard-meeting-textfield-details-placeholder = What is your meeting about?
dashboard-meeting-to-step = To step {$step}
dashboard-meeting-date-and-time = Date & time
dashboard-meeting-date-from = from
dashboard-meeting-date-to = to
dashboard-meeting-date-field-error-invalid-value = The start date and the end date need to be valid values
dashboard-meeting-date-field-error-duration = The meeting can't end before it starts
dashboard-meeting-date-field-error-future = The start date must begin in the future
dashboard-meeting-time-independent-yes = Unscheduled meeting
dashboard-meeting-time-independent-no = Scheduled meeting
dashboard-meeting-time-independent-tooltip = You can create a meeting with or without a precise time limit.
dashboard-meeting-notification-success-create = The meeting {$event} was created successfully!
dashboard-meeting-notification-success-edit = The changes in {$event} were saved successfully!
dashboard-meeting-notification-error = Something went wrong. Please try again later.
dashboard-meeting-switch-enabled = Enabled
dashboard-meeting-switch-disabled = Disabled
dashboard-meeting-shared-folder-label = Shared folder
dashboard-meeting-shared-folder-create-error-message = Unfortunately, the shared folder could not be created.
dashboard-meeting-shared-folder-create-retry-error-message = Unfortunately, the shared folder could not be created. Please try again later.
dashboard-meeting-shared-folder-delete-error-message = Unfortunately, an error occurred, the shared folder could not be deleted.
dashboard-meeting-shared-folder-delete-retry-error-message = Unfortunately, the shared folder could not be deleted. Please try again later.
dashboard-meeting-shared-folder-error-cancel-button = Cancel
dashboard-meeting-shared-folder-error-retry-button = Retry
dashboard-meeting-shared-folder-error-ok-button = Ok
dashboard-meeting-grant-moderator-rights = Grant moderator rights
dashboard-meeting-revoke-moderator-rights = Revoke moderator rights
dashboard-meeting-livestream-label = Livestream
dashboard-meeting-livestream-platform-label = Platform
dashboard-meeting-livestream-platform-name-label = Name
dashboard-meeting-livestream-platform-name-placeholder = Add name
dashboard-meeting-livestream-platform-name-required = This is a mandatory field
dashboard-meeting-livestream-streaming-endpoint-label = Streaming receiver URL
dashboard-meeting-livestream-streaming-endpoint-placeholder = Add URL
dashboard-meeting-livestream-streaming-endpoint-invalid-url = Must enter a valid URL
dashboard-meeting-livestream-streaming-endpoint-required = This is a mandatory field
dashboard-meeting-livestream-public-url-label = Livestream URL
dashboard-meeting-livestream-public-url-placeholder = Add URL
dashboard-meeting-livestream-public-url-invalid-url = Must enter a valid URL
dashboard-meeting-livestream-public-url-required = This is a mandatory field
dashboard-meeting-livestream-streaming-key-label = Streaming key
dashboard-meeting-livestream-streaming-key-placeholder = Add Streaming key
dashboard-meeting-livestream-streaming-key-required = This is a mandatory field

streaming-targets-request-error = Could not add streaming target

dashboard-meeting-details-page-future = future
dashboard-meeting-details-page-past = past
dashboard-meeting-details-page-description-title = Description
dashboard-meeting-details-page-time-independent = time independent
dashboard-meeting-details-page-all-day = all day at {$date}
dashboard-meeting-details-page-participant-pending = Open invitations
dashboard-meeting-details-page-participant-accepted = Accepted
dashboard-meeting-details-page-participant-declined = Declined
dashboard-meeting-details-page-participant-tentative = Tentative
dashboard-meeting-details-page-participant-limit = Maximum of {maxParticipants} participants are admitted to the meeting, incl. you as moderator.

dashboard-meeting-recurrence-none = No repetition
dashboard-meeting-recurrence-daily = Daily
dashboard-meeting-recurrence-weekly = Weekly
dashboard-meeting-recurrence-bi-weekly = Bi-Weekly
dashboard-meeting-recurrence-monthly = Monthly

dashboard-payment-status-downgraded = Attention: There is currently no valid payment method stored for your account.<br /> Currently you are restricted to the {$tariffName} plan.
dashboard-add-payment-button = Add payment

meeting-notification-kicked = You were removed from the meeting
meeting-notification-banned = You were banned from the meeting
meeting-notification-user-was-kicked = You successfully removed {$user} from the meeting
meeting-notification-user-was-banned = You successfully banned {$user} from the meeting
meeting-notification-user-was-accepted = You successfully accepted {$user} in the meeting
meeting-notification-participant-limit-reached = You have reached the maximum of {$participantLimit} participants in this conference.

feedback-button = Feedback
feedback-button-close = Close
feedback-button-submit = Submit
feedback-dialog-title = Your feedback
feedback-dialog-rating-function-range = Function range
feedback-dialog-rating-handling = Handling
feedback-dialog-rating-video-quality = Video quality
feedback-dialog-rating-audio-quality = Audio quality
feedback-dialog-headline = Please help us to continuously improve OpenTalk. We would like to invite you to give us direct feedback. Please rate some essential criteria (1=poor, 5=very good)
feedback-dialog-label-liked = What did you like the most?
feedback-dialog-label-problems = Did you have any problems?
feedback-dialog-label-critic = Do you have further criticism, suggestions, ideas for new functions?
feedback-dialog-description-placeholder = Your feedback is important to us. Please, share your thoughts with us
feedback-dialog-submit-success = Thank you for submitting
feedback-dialog-form-validation = required

protocol-join-session = Join protocol session

protocol-invite-button = Assign write permissions to participants
protocol-edit-invite-button = Manage write permissions
protocol-invite-reader-message = Protocol session has been started
protocol-invite-writer-message = Your where chosen to write a protocol for this session
protocol-invite-send-button = Show protocol to all
protocol-update-invite-send-button = Save changes
protocol-upload-pdf-button = Create Protocol PDF
protocol-upload-pdf-message = Protocol PDF created
protocol-created-notification = Protocol is created.
protocol-created-all-notification = Protocol was set up for all.
protocol-new-protocol-message-button = Open
protocol-hide = Hide protocol
protocol-tab-title = Create protocol

beta-flag-tooltip-text = You are using the <demoLink>beta version</demoLink> of OpenTalk. We are continuously developing new features and provide them as an early preview in our demo environment. Please note that there may be restrictions in using this version. Please feel free to send us any criticism, ideas or bugs to <reportEmailLink>{$reportEmail}</reportEmailLink>.<br /><br />Say Hello to OpenTalk!

tooltip-empty-favourites = You can mark favourites over the menu in the card.
meeting-delete-metadata-dialog-title = Leave Meeting
meeting-delete-metadata-dialog-message = Should this meeting be removed from the dashboard? This will permanently delete all information about this meeting (incl. recordings, protocols, voting results etc.)!
meeting-delete-metadata-dialog-checkbox = Confirm deletion
meeting-delete-metadata-button-leave-and-delete = Leave and delete all data
meeting-delete-metadata-button-leave-without-delete = Leave without deleting data
meeting-delete-metadata-submit-error =
    An error occurred while deleting the data.
    Please try again later!

send-error-button-text = Send diagnostic data
hide-diagnostic-data-button = Hide diagnostic data
show-diagnostic-data-button = Show diagnostic data
show-diagnostic-data-title = Something went wrong!
show-diagnostic-data-message = Do you want to send diagnostic data to {$errorReportEmail}?

form-validation-max-characters = Maximum number of allowed characters is {$maxCharacters}

votes-poll-overview-title = Polls and votings
votes-poll-overview-live-label = live
votes-poll-overview-not-live-label = not live

votes-result-not-live-tooltip = This vote is not live, the results will be announced when the vote end.
votes-result-live-tooltip = This vote is live, the results will announced continuously.

debug-panel-inbound-label = Inbound (current, avr, max):
debug-panel-outbound-label = Outbound (current, avr, max):
debug-panel-remote-count-label = Connection count:

whiteboard-tab-title = Whiteboard
whiteboard-create-pdf-button = Create pdf
whiteboard-start-whiteboard-button = Show whiteboard
whiteboard-new-whiteboard-message = Whiteboard is created
whiteboard-new-pdf-message = A new whiteboard pdf is available
whiteboard-new-whiteboard-message-button = Open
whiteboard-hide = Hide whiteboard

shortcut-hold-to-speak = Hold to speak
shortcut-pass-talking-stick = Pass on talking stick

meeting-required-start-date = Start date is required
meeting-required-end-date = End date is required
meeting-invalid-start-date = Start date is invalid
meeting-invalid-end-date = End date is invalid

recording-consent-message = A recording has been started. Do you consent that your audio and video is recorded?

recording-active-label = Recording active

recording-accept = Accept
recording-decline = Decline
recording-stopped-message = The recording has ended.
recording-stopped-message-with-link = <messageContent>The recording has ended. The corresponding file is located in the dashboard under the <messageLink>meeting-details</messageLink>.</messageContent>

emoji-category-smileys_people = Smileys & People
emoji-category-animals_nature = Animals & Nature
emoji-category-food_drink = Food & Drink
emoji-category-travel_places = Travel & Places
emoji-category-activities = Activities
emoji-category-objects = Objects
emoji-category-symbols = Symbols
emoji-category-flags = Flags

time-limit-more-than-one-minute-remained = Maximum conference time will be reached. This conference will end automatically in {$minutes} minutes.
time-limit-less-than-one-minute-remained = Maximum conference time will be reached. This conference will end automatically in a few seconds.

conference-view-trigger-button = Select view
conference-view-speaker = Speaker-View
conference-view-grid = Grid-View
conference-view-fullscreen = Fullscreen
shared-folder-open-label = Open shared folder
shared-folder-password-label = Copy Folder-password

imprint-label = Imprint
data-protection-label = Data protection

version-label = Product version - {$version}
dev-version = (preview)

reconnection-loop-dialogbox-title = Reconnecting to the room
reconnection-loop-abort-button = Abort

glitchtip-crash-report-title=  Oh, it looks like we're having issues.
glitchtip-crash-report-subtitle = Our team has been notified.
glitchtip-crash-report-subtitle2 = If you’d like to help, tell us what happened below.
glitchtip-crash-report-labelName = Name
glitchtip-crash-report-labelEmail = Email
glitchtip-crash-report-labelComments = What happened?
glitchtip-crash-report-labelClose = Close
glitchtip-crash-report-labelSubmit = Submit
glitchtip-crash-report-errorGeneric = An unknown error occurred while submitting your report. Please try again.
glitchtip-crash-report-errorFormEntry = Some fields were invalid. Please correct the errors and try again.
glitchtip-crash-report-successMessage = Your feedback has been sent. Thank you!
