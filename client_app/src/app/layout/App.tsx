import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Container } from "semantic-ui-react";
import ActivitityDashboard from "../../features/activities/dashboard/ActivitityDashboard";
import LoadingComponent from "./LoadingComponent";
import NavBar from "./NavBar";
import { useStore } from "./stores/store";

function App() {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content={"Loading app"} />;

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivitityDashboard />
      </Container>
    </>
  );
}

export default observer(App);
