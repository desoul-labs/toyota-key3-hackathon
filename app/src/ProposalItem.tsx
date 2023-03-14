import { Button, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import Person2Icon from '@mui/icons-material/Person2';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";

interface ProposalItemProps {
  key: string,
  proposal: {
    id: string;
    title: string;
    description: string;
    expiredAt: string;
    user?: string;
  }
}

function ProposalItem({ proposal }: ProposalItemProps) {
  const navigate = useNavigate();
  const ProposalItemClicked = () => {
    navigate(`/proposal/${proposal.id}`);
  }
  return (
    <>
      <div className="flex justify-between items-center mb-2 mx-1" style={{ height: "90px" }} onClick={() => ProposalItemClicked()}>
        <div>
          <h3 className="text-lg mb-2 mt-2">{proposal.title}</h3>
          <p className="text-sm">{proposal.description}</p>
        </div>
        <div className="flex flex-col items-center mr-2">
          <div className="flex items-center">
            <Person2Icon />
            <Typography sx={{ marginRight: '10px' }} component="span" variant="body2" color="text.primary">
              {proposal.user}
            </Typography>
          </div>
          <div className="flex items-center mt-1">
            <AccessAlarmIcon />
            <Typography component="span" variant="body2" color="text.primary">
              {new Date(parseInt(proposal.expiredAt) * 1000).toLocaleString().slice(0, 10)}
            </Typography>
          </div>
        </div>
      </div>

      <Divider sx={{ borderBottomWidth: 1, backgroundColor: "black" }} />
    </>
  );
}

export default ProposalItem;