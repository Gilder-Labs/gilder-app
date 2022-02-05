import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { MemberCard } from "../components";
import { FlatList } from "react-native";

export default function ActivityScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  const { realmMembers } = useAppSelector((state) => state.realms);

  const renderMember = ({ item }: any) => {
    return <MemberCard key={item.governingTokenOwner} member={item} />;
  };

  return (
    <Container>
      {/* <Container>
        {realmMembers.map((member) => (
          <MemberCard key={member.governingTokenOwner} member={member} />
        ))}
      </Container> */}
      <FlatList
        data={realmMembers}
        renderItem={renderMember}
        keyExtractor={(item) => item.governingTokenOwner}
      />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
  padding-top: ${(props) => props.theme.spacing[2]};
`;
