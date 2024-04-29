# 1.0.26

### Bug fixes

- Fixed issue with sorting order of hand raised participants. ([#1819](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1819))

# 1.0.25

### UI/UX Fixes

- Add missing role and aria label to the duration field. ([#1710](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1710))

## 1.0.24

### Stability Improvements

-  Prevent push to talk feature to be activated by selecting sort option using the `space` key. ([#1753](https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1753))

## 1.0.23

### Stability Improvements

- Removed excessive hotkey logic from the shared package. (!1251)

## 1.0.20

### Stability Improvements

- Add extra reducers to control hotkeys state (!1039)

## 1.0.18

### New Features

- Add legal vote image. (!1008)

## 1.0.17

### New Features

- Add informational icon. (!980)

## 1.0.16

- Adjust chat types which were not aligned with backend (!978)

## 1.0.6

### New Features

- Talking Stick: Add necessary types and shared components for the talking stick feature.

### Stability Improvements

- Moved shared types between enterprise components and monorepo into the common package. (!948)
- Enforce minimum participants for the participant shuffle method. (!948)

## 1.0.5

### Stability Improvements

- Fix: Notification implementation (!823)

## 1.0.4-rc2

### UI/UX Fixes

- Legal vote review fixes (!818)
- Move notification to common package to be used in ee module and the app (!814)

### Stability Improvements

- Fixing the installing of the enterprise modules (!817)

## 1.0.4-rc1

### UI/UX Fixes

- Legal Vote Enhancements (!812)

## 1.0.4-rc0

### Stability Improvements

- Add license headers + ci license check (!813)

## 1.0.3

### Stability Improvements

- Fixing version of common package(using same number result in caching problem) (!808)
- Fix: pipeline failes when /common package is publishing with same version number (!811)

## 1.0.2

### Stability Improvements

- Fix extending signaling api types to better match creating for a signaling in external modules (!806)
- Fix createSignalingApiCallType to be compactiable with enterpise module library (!804)
- Fix gitlab registry publishing on common component library (!802)
- Fixup contitions for publish common components CI && updated README.md in /packages/common (!800)

## 1.0.1

### Stability Improvements

- Add common component and types as monorepo package (!798)

## 1.0.0

### New Features

- Add common component as package (!798)
