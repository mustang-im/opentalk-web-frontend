// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
module.exports = {
  standard: "WCAG2AAA",
  level: "error",
  defaults: {
    timeout: 500000,
    wait: 2000,
    ignore: [],
    useIncognitoBrowserContext: false,
    chromeLaunchConfig: {
      executablePath: "/usr/local/bin/chromium'",
      args: ['--no-sandbox', '--headless', '--disable-gpu']
    },
    reporters: [
        "cli",
        ["pa11y-ci-reporter-html", { destination: "./reports" }],
        ["json", { fileName: "./reports/gl-accessibility.json" }]
    ]
  },
  urls: [
    {
      url: `https://test1:Passw0rd2023@www.1305.review-latest.kube.opentalk.run/dashboard`,
      actions: [
        "wait for element button[data-testid='wrong-browser-dialog-submit-button'] to be visible",
        "click element button[data-testid='wrong-browser-dialog-submit-button']",
        "wait for element input[type='submit'] to be visible",
        `set field input[name='username'] to test1`,
        `set field input[name='password'] to Passw0rd2023`,
        "click element input[type='submit']",
        "wait for element div[data-testid='favorite-icon'] to be visible"
      ]
    },
    {
      url: `https://test1:Passw0rd2023@www.1305.review-latest.kube.opentalk.run/dashboard/meetings`,
      actions: [
        "wait for element div[data-testid='MeetingOverviewCard'] to be visible",
      ]
    }
  ]
}
