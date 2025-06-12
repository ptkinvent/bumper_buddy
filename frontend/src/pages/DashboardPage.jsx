import MultiColumnLayout, { MainColumn, AsideColumn } from "../layouts/MultiColumnLayout";
import { Heading, Subheading } from "../elements/heading";

export default function DashboardPage() {
  return (
    <MultiColumnLayout currentTab="dashboard">
      <MainColumn>
        <Heading>Dashboard</Heading>
      </MainColumn>
      <AsideColumn>
        <Subheading>Aside</Subheading>
      </AsideColumn>
    </MultiColumnLayout>
  );
}
