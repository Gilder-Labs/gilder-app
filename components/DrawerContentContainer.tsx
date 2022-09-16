import { DrawerItemList } from "@react-navigation/drawer";
import { FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { RealmIconButton } from "./RealmIconButton";
import { RealmSelectModal } from "./RealmSelectModal";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { useTheme } from "styled-components";
import Logo from "../assets/images/GilderLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { faGear } from "@fortawesome/pro-regular-svg-icons/faGear";
import { faGrid2 } from "@fortawesome/pro-regular-svg-icons/faGrid2";

import { fetchRealm, selectRealm } from "../store/realmSlice";
import { fetchOwnVotes } from "../store/memberSlice";

import { Typography } from "./Typography";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { ChatRoomList } from "../elements";

export function DrawerContentContainer(props: any) {
  const theme = useTheme();
  const [realmSelectisOpen, setRealmSelectIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const { selectedRealm, realmsData, realmWatchlist } = useAppSelector(
    (state) => state.realms
  );
  const { publicKey } = useAppSelector((state) => state.wallet);

  useEffect(() => {
    // when a user enters app, if they don't have any realms selected, make the modal open to pick some
    if (!realmWatchlist.length) {
      setRealmSelectIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (selectedRealm) {
      dispatch(fetchOwnVotes({ walletId: publicKey, realm: selectedRealm }));
    }
  }, [selectedRealm, publicKey]);

  const realmDisplayName = realmsData[selectedRealm?.pubKey]?.displayName;

  const renderRealmIcon = ({ item }: any) => {
    return <RealmIconButton realmId={item} key={item} />;
  };

  const handleSettingsPress = () => {
    // @ts-ignore
    navigation.push("RealmSettings", {});
  };

  const handleOnClose = () => {
    setRealmSelectIsOpen(false);
    if (!selectedRealm && realmWatchlist.length) {
      dispatch(fetchRealm(realmWatchlist[0]));
    }
  };

  const handleAddRealmOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRealmSelectIsOpen(true);
  };

  const handleDiscoverPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    //@ts-ignore
    navigation.push("Discover");
  };

  return (
    <DrawerRootContainer {...props} style={{ backgroundColor: "#131313" }}>
      <StyledHeader>
        <GilderLogo source={Logo} />
        {/* <BetaBadge> BETA </BetaBadge> */}
      </StyledHeader>
      <StyledContainer>
        <RealmScrollContainer>
          <FlatList
            data={realmWatchlist}
            renderItem={renderRealmIcon}
            keyExtractor={(item) => item}
            style={{ padding: 8 }}
            scrollIndicatorInsets={{ right: -2 }}
            ListHeaderComponent={
              <View>
                <DiscoverButton
                  onPress={handleDiscoverPress}
                  activeOpacity={0.4}
                >
                  <FontAwesomeIcon
                    icon={faGrid2}
                    size={20}
                    color={theme?.gray[500]}
                  />
                </DiscoverButton>
                <Divider />
              </View>
            }
            ListFooterComponent={
              <View>
                <Divider />
                <AddRealmButtonContainer
                  onPress={handleAddRealmOpen}
                  activeOpacity={0.4}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    size={20}
                    color={theme?.gray[500]}
                  />
                </AddRealmButtonContainer>
                <EmptyView />
              </View>
            }
          />
        </RealmScrollContainer>
        <DrawerContentContainerWrapper>
          <Content>
            <RealmNameContainer>
              <Typography
                size="h4"
                bold={true}
                shade="300"
                marginBottom="0"
                maxLength={14}
                text={realmDisplayName ? realmDisplayName : selectedRealm?.name}
              />
              <IconButton onPress={handleSettingsPress}>
                <FontAwesomeIcon
                  icon={faGear}
                  size={20}
                  color={theme?.gray[500]}
                />
              </IconButton>
            </RealmNameContainer>
            <DrawerItemList {...props} />
            {/* <ChatDivider />
            <Typography
              text="Chat"
              shade="400"
              bold={true}
              marginLeft="3"
              size="subtitle"
              marginBottom="2"
            />
            <ChatRoomList {...props} /> */}
          </Content>
          <ConnectWalletButton />
        </DrawerContentContainerWrapper>
      </StyledContainer>
      <RealmSelectModal
        open={realmSelectisOpen}
        handleOnClose={handleOnClose}
      />
    </DrawerRootContainer>
  );
}

const DrawerRootContainer = styled.View`
  padding-top: 52px;
`;

const IconButton = styled.TouchableOpacity`
  border-radius: 100px;
  padding: ${(props) => props.theme.spacing[1]};
  /* background: ${(props) => props.theme.gray[800]}; */
`;

const RealmNameContainer = styled.View`
  margin-left: ${(props) => props.theme.spacing[3]};
  margin-right: ${(props) => props.theme.spacing[3]};
  padding-top: ${(props) => props.theme.spacing[4]};
  padding-bottom: ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[2]};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-color: ${(props) => props.theme.gray[800]};
  border-bottom-width: 2px;
`;

const StyledContainer = styled.View`
  height: 100%;
  flex-direction: row;
  align-content: stretch;
  align-self: stretch;
  background-color: ${(props) => props.theme.gray[900]};
`;

const RealmScrollContainer = styled.View`
  height: 100%;
  background: ${(props) => props.theme.gray[800]};
  justify-content: center;
  align-items: center;
`;

const AddRealmButtonContainer = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.gray[900]};
  border: 2px dashed ${(props) => props.theme.gray[500]};
`;

const DiscoverButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.gray[900]};
  /* border: 2px dashed ${(props) => props.theme.gray[500]}; */
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const Divider = styled.View`
  /* width: 48px; */
  height: 2px;
  max-height: 2px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.gray[700]};
  margin-bottom: ${(props) => props.theme.spacing[3]};
  margin-left: ${(props) => props.theme.spacing[1]};
  margin-right: ${(props) => props.theme.spacing[1]};
`;

const ChatDivider = styled.View`
  height: 2px;
  max-height: 2px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.gray[800]};
  margin-bottom: ${(props) => props.theme.spacing[3]};
  margin-left: ${(props) => props.theme.spacing[3]};
  margin-right: ${(props) => props.theme.spacing[3]};
`;

const DrawerContentContainerWrapper = styled.View`
  flex: 1;
  /* height: 100%; */
  /* padding-bottom: 100px; */
`;

const GilderLogo = styled.Image`
  height: 30px;
  width: 120px;
  margin-right: ${(props) => props.theme.spacing[1]};
`;

const StyledHeader = styled.View`
  background-color: ${(props) => props.theme.gray[1000]};
  align-items: center;
  padding-left: ${(props) => props.theme.spacing[4]};
  padding-bottom: ${(props) => props.theme.spacing[2]};
  /* border-bottom-color: ${(props) => props.theme.gray[800]}; */
  border-bottom-width: 1px;
  flex-direction: row;
  /* max-height: 40px; */
`;

const Content = styled.View`
  flex: 1;
`;

// const BetaBadge = styled.Text`
//   font-size: 12px;
//   border-radius: 4px;
//   border: 1px solid ${(props) => props.theme.gray[400]};
//   color: ${(props) => props.theme.gray[400]};
//   background: ${(props) => props.theme.gray[700]}44;
// `;

const EmptyView = styled.View`
  height: 200px;
`;
