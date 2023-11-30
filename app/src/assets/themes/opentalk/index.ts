// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import closeSvg from '@opentalk/common/assets/icons/source/close.svg';
import doneSvg from '@opentalk/common/assets/icons/source/done.svg';

import { getPalette } from './palette';

export function createOpenTalkTheme(mode: PaletteMode = 'light') {
  const palette = getPalette(mode);
  const theme = createTheme({
    borderRadius: {
      small: 2,
      medium: 8,
      large: 40,
    },
    palette: {
      ...palette,
      mode,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            height: '100%',
            margin: 0,
            padding: 0,
          },
          body: {
            height: '100%',
            margin: 0,
            padding: 0,
            background: `url('/assets/background.svg') no-repeat`,
            backgroundSize: 'cover',
          },
          '#root': {
            height: '100%',
            display: 'flex',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          color: 'primary',
          variant: 'contained',
          disableElevation: true,
          disableFocusRipple: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.borderRadius.large,
            textTransform: 'none',
            ':disabled': {
              opacity: 0.5,
            },
          }),
          sizeSmall: ({ theme }) => ({
            fontSize: theme.typography.pxToRem(12),
            padding: theme.spacing(1, 2.5),
          }),
          sizeMedium: ({ theme }) => ({
            padding: theme.spacing(1.25, 2.25),
            '& .MuiButton-startIcon > *:nth-of-type(1), & .MuiButton-endIcon > *:nth-of-type(1)': {
              fontSize: theme.typography.pxToRem(14),
            },
            [theme.breakpoints.down('md')]: {
              padding: theme.spacing(1, 1.75),
              fontSize: theme.typography.pxToRem(12),
            },
          }),
          sizeLarge: ({ theme }) => ({
            fontSize: theme.typography.pxToRem(16),
            padding: theme.spacing(1.5, 2.25),
            '& .MuiButton-startIcon > *:nth-of-type(1), & .MuiButton-endIcon > *:nth-of-type(1)': {
              fontSize: theme.typography.pxToRem(20),
            },
            [theme.breakpoints.down('md')]: {
              fontSize: theme.typography.pxToRem(14),
              padding: theme.spacing(1.25, 2),
              '& .MuiButton-startIcon > *:nth-of-type(1), & .MuiButton-endIcon > *:nth-of-type(1)': {
                fontSize: theme.typography.pxToRem(16),
              },
            },
          }),
          containedPrimary: ({ theme }) => ({
            color: mode === 'light' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
            ':disabled': {
              backgroundColor: theme.palette.primary.main,
              color: mode === 'light' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
            },
            '&.MuiButtonBase-root.Mui-disabled': {
              backgroundColor: theme.palette.primary.main,
            },
          }),
          containedSecondary: ({ theme }) => ({
            ':disabled': {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
            },
          }),
          outlinedSecondary: ({ theme }) => ({
            borderColor: theme.palette.outline,
            ':disabled': {
              color: theme.palette.secondary.main,
            },
            ':hover': {
              backgroundColor: 'transparent',
            },
          }),
          containedInherit: ({ theme }) => ({
            color: mode === 'light' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
          }),
          textSecondary: {
            ':hover': {
              backgroundColor: 'unset',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          sizeMedium: ({ theme }) => ({
            fontSize: theme.typography.pxToRem(20),
          }),
          sizeLarge: ({ theme }) => ({
            '& > .MuiSvgIcon-root': {
              fontSize: theme.typography.pxToRem(20),
              [theme.breakpoints.down('md')]: {
                fontSize: theme.typography.pxToRem(16),
              },
            },
          }),
          root: ({ ownerState, theme }) => ({
            borderRadius: theme.borderRadius.large,
            padding: theme.spacing(1.5, 2),
            [theme.breakpoints.down('md')]: {
              padding: theme.spacing(1.25, 1.75),
            },
            '& > .MuiSvgIcon-root': {
              fontSize: theme.typography.pxToRem(16),
              [theme.breakpoints.down('md')]: {
                fontSize: theme.typography.pxToRem(12),
              },
            },
            ...(ownerState.variant === 'toolbar' && {
              backgroundColor: theme.palette.secondary.main,
              borderRadius: theme.borderRadius.large,
              '&:hover': {
                background: theme.palette.secondary.lightest,
                '& > svg': {
                  fill: theme.palette.secondary.main,
                },
              },
              '& svg': {
                fill: theme.palette.common.white,
              },
              '& > .MuiSvgIcon-root': {
                fontSize: theme.typography.pxToRem(18),
                [theme.breakpoints.down('md')]: {
                  fontSize: theme.typography.pxToRem(16),
                },
              },
              ':disabled': {
                opacity: 0.5,
                backgroundColor: theme.palette.secondary.main,
              },
            }),
          }),
          colorPrimary: ({ theme }) => ({
            background: theme.palette.primary.main,
            color: mode === 'light' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
            ':hover': {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
            },
            ':disabled': {
              opacity: 0.5,
              backgroundColor: theme.palette.primary.main,
              color: mode === 'light' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
            },
          }),
          colorSecondary: ({ theme }) => ({
            backgroundColor: theme.palette.secondary.lighter,
            ':hover': {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
            },
            ':disabled': {
              opacity: 0.5,
              backgroundColor: theme.palette.secondary.lighter,
            },
          }),
        },
      },
      MuiSwitch: {
        defaultProps: {
          color: 'secondary',
        },
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(0, 0.25, 0, 0),
            width: theme.typography.pxToRem(46),
            height: theme.typography.pxToRem(24),
            marginRight: 0,
          }),
          switchBase: ({ theme }) => ({
            padding: theme.spacing(0.25),
            '&.Mui-checked': {
              color: theme.palette.common.white,
              '& .MuiSwitch-thumb:before': {
                backgroundImage: `url(${doneSvg})`,
              },
              '& + .MuiSwitch-track': {
                opacity: 1,
              },
            },
            '&.Mui-focusVisible': {
              backgroundColor: theme.palette.primary.main,
              transitionDuration: '100ms',
            },
          }),
          track: {
            opacity: 1,
            borderRadius: 16,
          },
          thumb: ({ theme }) => ({
            width: theme.typography.pxToRem(20),
            height: theme.typography.pxToRem(20),
            '&:before': {
              content: "''",
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: `url(${closeSvg})`,
              backgroundSize: 8,
            },
          }),
          colorSecondary: ({ theme }) => ({
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.secondary.lighter,
            },
          }),
        },
      },
      MuiSlider: {
        styleOverrides: {
          thumb: ({ theme }) => ({
            color: theme.palette.secondary.main,
            boxShadow: '0 0 0 0px !important',
            '&.Mui-focusVisible': {
              backgroundColor: theme.palette.primary.main,
              transitionDuration: '100ms',
            },
          }),
          markLabel: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
          mark: {
            width: 0,
            height: 0,
            opacity: 0,
          },
          track: ({ theme }) => ({
            color: theme.palette.secondary.main,
          }),
          rail: ({ theme }) => ({
            color: theme.palette.secondary.lighter,
          }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontSize: theme.typography.pxToRem(14),
            [theme.breakpoints.down('md')]: {
              fontSize: theme.typography.pxToRem(12),
            },
            textTransform: 'none',
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            position: 'relative',
            fontWeight: 600,
            lineHeight: 'unset',
            color: theme.palette.primary.contrastText,
            '&.Mui-focused': {
              color: theme.palette.primary.contrastText,
            },
            [theme.breakpoints.down('md')]: {
              fontSize: theme.typography.pxToRem(16),
            },
            '& > span': {
              paddingBottom: theme.spacing(1.5),
              display: 'inline-block',
            },
          }),
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            display: 'flex',
            borderRadius: 2,
            fontSize: theme.typography.pxToRem(16),
            fontWeight: 400,
            lineHeight: 1.25,
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            border: `1px solid ${theme.palette.secondary.main}`,
            '& .MuiSvgIcon-root': {
              color:
                ownerState.color === 'primary'
                  ? theme.palette.secondary.contrastText
                  : theme.palette.primary.contrastText,
            },
            ':hover': {
              border: `1px solid ${theme.palette.primary.main}`,
            },
            '&.Mui-focused': {
              backgroundColor: mode === 'light' ? theme.palette.common.white : theme.palette.text.secondary,
              color: theme.palette.primary.contrastText,
              border: `1px solid ${theme.palette.primary.main}`,
              '& .MuiSvgIcon-root': {
                color: theme.palette.primary.contrastText,
              },
            },
            '&.Mui-disabled': {
              backgroundColor: 'transparent',
              color: theme.palette.primary.contrastText,
              borderColor: theme.palette.secondary.main,
              '& .MuiSvgIcon-root': {
                color: theme.palette.primary.contrastText,
              },
            },
            '&.Mui-error': {
              backgroundColor: mode === 'light' ? theme.palette.common.white : theme.palette.text.secondary,
              color: theme.palette.primary.contrastText,
              borderColor: theme.palette.error.main,
            },
            [theme.breakpoints.down('md')]: {
              lineHeight: 'unset',
            },
            ...(ownerState.checked && {
              '&:not(&.Mui-focused):not(:hover)': {
                backgroundColor: '#C1E9D2',
                color: mode === 'light' ? theme.palette.primary.contrastText : theme.palette.secondary.contrastText,
                border: '1px solid #24A037',
                '&::after': {
                  content: `url(${doneSvg})`,
                  position: 'absolute',
                  backgroundColor: '#C1E9D2',
                  paddingLeft: theme.spacing(1),
                  right: theme.spacing(2),
                  width: theme.typography.pxToRem(24),
                  height: theme.typography.pxToRem(16),
                  [theme.breakpoints.down('md')]: {
                    width: theme.typography.pxToRem(20),
                    height: theme.typography.pxToRem(12),
                    transform: 'translateY(-1px)',
                  },
                },
              },
            }),
          }),
          input: ({ theme }) => ({
            padding: theme.spacing(1.5, 2),
            height: 'inherit',
            '&.Mui-disabled': {
              color: theme.palette.primary.contrastText,
              WebkitTextFillColor: theme.palette.primary.contrastText,
            },
          }),
          multiline: {
            padding: 0,
          },
          colorSecondary: ({ theme }) => ({
            backgroundColor: theme.palette.secondary.lighter,
            color: theme.palette.secondary.main,
          }),
          inputAdornedStart: {
            '&&': {
              paddingLeft: 0,
            },
          },
          inputAdornedEnd: ({ theme }) => ({
            padding: theme.spacing(1.5, 6, 1.5, 2),
          }),
          inputSizeSmall: ({ theme }) => ({
            padding: theme.spacing(1, 4, 1, 1.5),
            fontSize: theme.typography.pxToRem(14),
          }),
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: 'inherit',
            '& .MuiSvgIcon-root': {
              fontSize: theme.typography.pxToRem(16),
              [theme.breakpoints.down('md')]: {
                fontSize: theme.typography.pxToRem(12),
              },
            },
          }),
          positionEnd: ({ theme }) => ({
            position: 'absolute',
            right: theme.spacing(2),
          }),
          positionStart: ({ theme }) => ({
            padding: theme.spacing(1.5, 2),
            marginRight: 0,
          }),
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginLeft: 3,
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: ({ theme }) => ({
            width: theme.typography.pxToRem(40),
            height: theme.typography.pxToRem(40),
            fontWeight: 500,
            [theme.breakpoints.down('md')]: {
              width: theme.typography.pxToRem(32),
              height: theme.typography.pxToRem(32),
            },
          }),
          text: ({ theme }) => ({
            fill: theme.palette.secondary.contrastText,
          }),
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& > * :first-of-type': {
              color: theme.palette.secondary.light,
            },
            '& > * .Mui-active': {
              color: theme.palette.secondary.main,
            },
            '& > * .Mui-completed': {
              color: theme.palette.secondary.main,
            },
          }),
          label: ({ theme }) => ({
            fontWeight: 500,
            fontFamily: 'Opentalk',
            fontSize: theme.typography.pxToRem(22),
            [theme.breakpoints.down('md')]: {
              fontSize: theme.typography.pxToRem(18),
            },
          }),
          labelContainer: ({ theme }) => ({
            color: theme.palette.secondary.main,
          }),
        },
      },
      MuiStepConnector: {
        styleOverrides: {
          line: ({ theme }) => ({
            borderTopWidth: 2,
            borderColor: theme.palette.secondary.main,
          }),
        },
      },
      MuiStepButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiSvgIcon-root:not(.Mui-active)': {
              fontSize: theme.typography.pxToRem(20),
              padding: 10,
              background: theme.palette.secondary.lighter,
              fill: theme.palette.primary.contrastText,
              borderRadius: '50%',
              [theme.breakpoints.down('md')]: {
                fontSize: theme.typography.pxToRem(16),
                padding: 8,
              },
            },
          }),
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: ({ theme }) => ({
            color: 'inherit',
            padding: theme.spacing(0.75),
            right: theme.spacing(1.25),
            [theme.breakpoints.down('md')]: {
              padding: theme.spacing(1),
            },
          }),
          select: ({ theme }) => ({
            '&&': {
              minHeight: 'unset',
              paddingRight: theme.spacing(6),
              [theme.breakpoints.down('md')]: {
                paddingRight: theme.spacing(5),
              },
            },
          }),
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontWeight: 400,
            padding: theme.spacing(1.5, 2),

            '&: hover': {
              background: theme.palette.secondary.lighter,
            },
            '&.Mui-selected, &.Mui-selected:hover': {
              background: theme.palette.secondary.lightest,
            },
          }),
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            paddingRight: theme.spacing(1.5),
            fontSize: theme.typography.pxToRem(14),
            border: `1px solid ${theme.palette.secondary.main}`,
            borderRadius: theme.borderRadius.large,
            height: 'unset',
            [theme.breakpoints.down('md')]: {
              fontSize: theme.typography.pxToRem(10),
            },
            ':hover': {
              background: mode === 'light' ? theme.palette.common.white : theme.palette.secondary.contrastText,
            },
          }),
          label: ({ theme }) => ({
            paddingRight: theme.spacing(2.5),
          }),
          deleteIcon: ({ theme }) => ({
            fontSize: theme.typography.pxToRem(8),
            color: theme.palette.text.primary,
            marginRight: 0,
            ':hover': {
              color: theme.palette.text.primary,
            },
          }),
          avatar: ({ theme }) => ({
            width: 'calc(2.5rem - 2px)',
            height: 'calc(2.5rem - 2px)',
            marginLeft: 0,
            [theme.breakpoints.down('md')]: {
              width: 'calc(2rem - 2px)',
              height: 'calc(2rem - 2px)',
            },
          }),
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.common.white,
          }),
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontWeight: 400,
          },
          secondary: ({ theme }) => ({
            color: theme.palette.primary.contrastText,
          }),
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.primary.contrastText,
          }),
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            marginTop: 16,
            marginBottom: 16,
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: ({ theme }) => ({
            marginLeft: theme.typography.pxToRem(9),
            '&.MuiRadio-colorPrimary': {
              color: theme.palette.primary.main,
              '&.Mui-checked': {
                color: theme.palette.primary.main,
              },
            },
            '&.MuiRadio-colorSecondary': {
              color: theme.palette.secondary.main,
              '&.Mui-checked': {
                color: theme.palette.secondary.main,
              },
            },
          }),
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(0, 3, 3, 3),
            '&> :not(:first-of-type)': {
              marginLeft: theme.spacing(3),
            },
          }),
        },
      },
      MuiDateTimePickerToolbar: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiTypography-root': {
              color: theme.palette.text.primary,
            },
          }),
        },
      },
      MuiDateTimePickerTabs: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiTab-root': {
              color: theme.palette.secondary.main,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
          }),
        },
      },
      MuiClock: {
        styleOverrides: {
          wrapper: ({ theme }) => ({
            '& .MuiClockNumber-root': {
              color: theme.palette.text.primary,
            },
          }),
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          noOptions: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
        },
      },
    },
    typography: (palette) => ({
      allVariants: {
        fontFamily: ['Opentalk', 'serif'].join(','),
        color: palette.text.primary,
        fontWeight: 500,
        lineHeight: 1.25,
      },
    }),
  });

  /**
   * setting responsive fonts
   */

  theme.typography = {
    ...theme.typography,
    h1: {
      lineHeight: 1.3,
      fontSize: theme.typography.pxToRem(22),
      [theme.breakpoints.down('md')]: {
        fontSize: theme.typography.pxToRem(18),
      },
    },
    h2: {
      fontSize: theme.typography.pxToRem(16),
      [theme.breakpoints.down('md')]: {
        fontSize: theme.typography.pxToRem(14),
      },
    },
    body1: {
      fontFamily: ['Opentalk', 'serif'].join(','),
      fontWeight: 500,
      fontSize: theme.typography.pxToRem(16),
      [theme.breakpoints.down('md')]: {
        fontSize: theme.typography.pxToRem(14),
      },
    },
    body2: {
      fontWeight: 400,
      fontSize: theme.typography.pxToRem(16),
      [theme.breakpoints.down('md')]: {
        fontSize: theme.typography.pxToRem(14),
      },
    },
    caption: {
      fontSize: theme.typography.pxToRem(12),
      fontWeight: 400,
      [theme.breakpoints.down('md')]: {
        fontSize: theme.typography.pxToRem(12),
      },
    },
  };
  return theme;
}
