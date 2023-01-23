import { Card, CardContent, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { ReactNode } from 'react';

const useStyles = makeStyles({
  root: {
    minWidth: 120,
    cursor: 'pointer',
  },
});

interface PresetCardProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const PresetCard = ({ icon, label, onClick }: PresetCardProps) => {
  const classes = useStyles();

  return (
    <Card onClick={onClick} className={classes.root}>
      <CardContent>
        {icon}
        <hr />
        <Typography variant="subtitle1">{label}</Typography>
      </CardContent>
    </Card>
  );
};
export default PresetCard;
