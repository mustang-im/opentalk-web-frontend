// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

window.config = {
  controller: '${CONTROLLER_HOST}',
  insecure: false,
  baseUrl: '${BASE_URL}',
  helpdeskUrl: '${HELPDESK_URL}',
  imprintUrl: '${IMPRINT_URL}',
  dataProtectionUrl: '${DATA_PROTECTION_URL}',
  userSurveyUrl: '${USER_SURVEY_URL}',
  userSurveyApiKey: '${USER_SURVEY_API_KEY}',
  errorReportAddress: "${ERROR_REPORT_ADDRESS}",
  beta: {
    isBeta: '${IS_BETA_RELEASE:-true}',
    badgeUrl: "${BETA_BADGE_URL}"
  },
  oidcConfig: {
    clientId: 'Frontend',
    redirectPath: '/auth/callback',
    signOutRedirectUri: '/dashboard',
    scope: 'openid profile email',
    popupRedirectPath: '/auth/popup_callback',
    authority: '${KEYCLOAK_HOST}',
  },
  changePassword: {
    active: '${CHANGE_PASSWORD_ACTIVE}',
    url: '${CHANGE_PASSWORD_URL}'
  },
  speedTest: {
    ndtServer: '${NDT_SERVER}',
    ndtDownloadWorkerJs: '/workers/ndt7-download-worker.js',
    ndtUploadWorkerJs: '/workers/ndt7-upload-worker.js',
  },
  features: {
    userSearch: true,
    muteUsers: true,
    resetHandraises: true,
    addUser: false,
    joinWithoutMedia: false,
    sharedFolder: false,
  },
  provider: {
	active: false, // indicates if we are are in the provider context
	accountManagementUrl: '${ACCOUNT_MANAGEMENT_URL}',
  },
  videoBackgrounds: '${VIDEO_BACKGROUNDS}',
  maxVideoBandwidth: '${MAX_VIDEO_BANDWIDTH}',
  version: '${PRODUCT_VERSION}',
  glitchtipDsn: '${SENTRY_DSN}',
  glitchtipRelease: "${SENTRY_RELEASE}"
};
