import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { MemberCard } from "../components";

export default function ActivityScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  const { realmMembers } = useAppSelector((state) => state.realms);

  return (
    <ScrollableContainer>
      <Container>
        {realmMembers.map((member) => (
          <MemberCard key={member.governingTokenOwner} member={member} />
        ))}
      </Container>
    </ScrollableContainer>
  );
}

const ScrollableContainer = styled.ScrollView`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
  padding-top: ${(props) => props.theme.spacing[2]};
`;

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
  padding: ${(props) => props.theme.spacing[2]};
  flex-wrap: wrap;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: stretch;
`;
