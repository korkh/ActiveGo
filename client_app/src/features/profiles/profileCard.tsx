import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Icon,
  Image,
} from "semantic-ui-react";
import { Profile } from "../../app/layout/models/profile";

interface Props {
  profile: Profile;
}

export default observer(function ProfileCard({ profile }: Props) {
  function truncate(str: string | undefined) {
    if (str) {
      return str.length > 40 ? str.substring(0, 37) + "..." : str;
    }
  }

  return (
    <Card as={Link} to={`/profiles/${profile.userName}`}>
      <Image src={profile.image || "/assets/user.png"} />
      <CardContent>
        <CardHeader>{profile.displayName}</CardHeader>
        <CardDescription>{truncate(profile.bio)}</CardDescription>
      </CardContent>
      <CardContent extra>
        <Icon name="user" />
        20 Followers
      </CardContent>
    </Card>
  );
});
