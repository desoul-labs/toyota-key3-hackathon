import { Button, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import Person2Icon from '@mui/icons-material/Person2';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CloseIcon from '@mui/icons-material/Close';

interface ProposalItemProps {
  proposal: {
    id: string;
    title: string;
    description: string;
    expiredAt: string;
    user?: string;
  }
}
function ProposalItem({ proposal }: ProposalItemProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-2" style={{ height: "90px" }}>
        <div>
          <h3 className="text-lg mb-2 mt-2">{proposal.title}</h3>
          <p className="text-sm">{proposal.description}</p>
        </div>
        <div className="flex items-center mr-2">
          <Person2Icon />
          <Typography sx={{ marginRight: '10px' }} component="span" variant="body2" color="text.primary">
            {proposal.user}
          </Typography>
          <AccessAlarmIcon />
          <Typography component="span" variant="body2" color="text.primary">
            {proposal.expiredAt}
          </Typography>
        </div>
      </div>
      <Divider sx={{ borderBottomWidth: 1, backgroundColor: "black" }} />
    </>
  );
}

export default ProposalItem;