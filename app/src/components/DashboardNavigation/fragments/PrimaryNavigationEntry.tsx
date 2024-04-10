// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Collapse, ListItemText, ListItem as MuiListItem, styled } from '@mui/material';

export const ListItem = styled(MuiListItem, {
  shouldForwardProp: (prop) => prop !== 'isSubmenuOpen',
})<{ isSubmenuOpen?: boolean }>(({ theme, isSubmenuOpen }) => ({
  padding: 0,
  paddingRight: theme.spacing(3),
  borderRadius: `${theme.borderRadius.large}px 0 0 ${theme.borderRadius.large}px`,
  background: isSubmenuOpen ? theme.palette.secondary.lightest : 'transparent',

  [theme.breakpoints.down('md')]: {
    borderRadius: 0,
    paddingRight: 0,
    marginLeft: 0,
  },

  '> *, & .MuiButton-root': {
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 3),
    borderRadius: theme.borderRadius.large,
    textDecoration: 'none',
    width: '100%',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    justifyContent: 'flex-start',

    '& svg': {
      fill: 'currentcolor',
    },

    '& .MuiListItemText-root': {
      paddingLeft: theme.spacing(2),
      fontSize: '1rem',
      '& .MuiListItemText-primary': {
        fontWeight: 'bold',
      },
    },

    '&:hover': {
      background: theme.palette.secondary.lightest,
    },

    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1.5, 3),
      borderRadius: 0,

      '*': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  },
  '& .active-link': {
    background: theme.palette.secondary.lightest,
  },
}));
interface NavigationProps {
  href?: string;
  target?: string;
  Icon: JSX.Element;
  collapsedBar: boolean;
  label: string;
  disabled?: boolean;
  isSubmenuOpen?: boolean;
  onClick?: () => void;
}

const PrimaryNavigationEntry = (props: NavigationProps) => {
  return (
    <ListItem isSubmenuOpen={props.isSubmenuOpen}>
      <Button
        onClick={props.onClick}
        href={props.href || ''}
        disabled={props.disabled}
        disableRipple
        target={props.target}
      >
        {props.Icon}
        <Collapse orientation="horizontal" in={!props.collapsedBar}>
          <ListItemText>{props.label}</ListItemText>
        </Collapse>
      </Button>
    </ListItem>
  );
};

export default PrimaryNavigationEntry;
