import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { PublicKeyTextCopy, Typography } from "../components";
import { abbreviatePublicKey } from "../utils";
import { ExpandableSection } from "react-native-ui-lib";
import { Linking } from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons/faChevronRight";
import { PublicKey } from "@solana/web3.js";
import { InstructionMapping } from "../utils/InstructionMapping";

interface InstructionCardProps {
  instruction: {
    pubkey: PublicKey;
    owner: PublicKey;
    account: {
      accountType: number;
      proposal: PublicKey; // proposalId
      instructions: Array<{
        programId: PublicKey;
        accounts: Array<any>;
        data: any;
      }>;
    };
  };
}

// Top level is the public key of the program
// second lvl is the first piece of data in the instruction, which is hte id of what the instruction is doing

export const InstructionCard = ({ instruction }: InstructionCardProps) => {
  const theme = useTheme();
  const [sectionOpen, setSectionOpen] = useState(false);

  const { account } = instruction;
  const instructionDetails = account?.instructions?.[0];
  const typeOfInstruction = instructionDetails?.data[0];
  const programId = instructionDetails?.programId.toBase58();
  const instructionInfo = InstructionMapping?.[programId]?.[typeOfInstruction];

  return (
    <Container>
      <ExpandableSection
        top={false}
        expanded={sectionOpen}
        sectionHeader={
          <InstructionHeaderContainer>
            <Typography
              text={
                instructionInfo?.name
                  ? instructionInfo.name
                  : abbreviatePublicKey(
                      instructionDetails?.programId.toBase58(),
                      5
                    )
              }
              marginBottom="0"
              bold={true}
            />
            {sectionOpen ? (
              <FontAwesomeIcon
                icon={faChevronDown}
                size={14}
                color={theme.gray[400]}
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronRight}
                size={14}
                color={theme.gray[500]}
              />
            )}
          </InstructionHeaderContainer>
        }
        onPress={() => setSectionOpen(!sectionOpen)}
      >
        <AccountsContainer>
          <Row>
            <Typography shade="500" text={"Program"} />
            <PublicKeyTextCopy
              publicKey={abbreviatePublicKey(
                instructionDetails?.programId.toBase58(),
                5
              )}
              noPadding={true}
              hideIcon={true}
              shade="300"
              size="body"
            />
          </Row>

          {instructionDetails?.accounts.map((account, index) => {
            return (
              <Row>
                <Typography
                  shade="500"
                  text={
                    instructionInfo?.accounts[index]?.name
                      ? instructionInfo?.accounts[index]?.name
                      : `Account ${index}`
                  }
                />

                <PublicKeyTextCopy
                  shade="300"
                  size="body"
                  publicKey={instructionDetails?.accounts?.[
                    index
                  ]?.pubkey?.toBase58()}
                  noPadding={true}
                  hideIcon={true}
                />
              </Row>
            );
          })}
        </AccountsContainer>
      </ExpandableSection>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  margin-left: ${(props: any) => props.theme.spacing[3]};
  margin-right: ${(props: any) => props.theme.spacing[3]};

  padding-left: ${(props: any) => props.theme.spacing[2]};
  padding-right: ${(props: any) => props.theme.spacing[2]};
  padding-top: ${(props: any) => props.theme.spacing[2]};
  padding-bottom: ${(props: any) => props.theme.spacing[2]};
`;

const InstructionHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding: ${(props: any) => props.theme.spacing[1]};
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${(props: any) => props.theme.spacing[1]};
`;

const AccountsContainer = styled.View`
  padding: ${(props: any) => props.theme.spacing[1]};
`;
