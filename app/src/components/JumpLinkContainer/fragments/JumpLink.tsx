// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Link, styled } from '@mui/material';

export type JumpLinkProps = {
  to: string;
  text: string;
};
const JumpLinkDisplay = styled(Link)(({ theme }) => ({
  position: 'fixed',
  top: '-40px',
  left: '45%',
  zIndex: theme.zIndex.jumpLink,
  textDecoration: 'none',
  color: theme.palette.secondary.contrastText,
  transition: 'top 195ms cubic-bezier(0.4, 0, 1, 1) 0ms',
  backgroundColor: theme.palette.secondary.light,
  borderRadius: '12px',
  padding: `${theme.typography.pxToRem(8)}`,
  outline: `3px solid ${theme.palette.primary.main}`,
  boxShadow: `5px 5px ${theme.palette.background}`,
  ':focus': {
    top: '20px',
  },
}));
export const JumpLink = ({ to, text }: JumpLinkProps) => {
  return <JumpLinkDisplay href={to}>{text}</JumpLinkDisplay>;
};
