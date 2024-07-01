import {Card, CardContent, Typography} from "@mui/material";

function ActivityCard({activity, }) {
  return (
    <Card sx={{minWidth: 275, mb: 1}} variant={'outlined'}>
      <CardContent>
        <Typography variant="subtitle1" component="div">
          <Typography fontWeight={'bold'} pb={1}>{activity.name}</Typography>
          Notes: {activity.notes || "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ActivityCard;
