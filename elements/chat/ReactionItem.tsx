import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "styled-components";

const styles = StyleSheet.create({
  reactionItem: {
    fontSize: 16,
  },
  reactionItemContainer: {
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 5,
    marginVertical: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

const areEqual = (prevProps, nextProps) => {
  const {
    count: prevCount,
    Icon: prevIcon,
    isOwnReaction: prevIsOwnReaction,
  } = prevProps;
  const {
    count: nextCount,
    Icon: nextIcon,
    isOwnReaction: nextIsOwnReaction,
  } = nextProps;

  return (
    prevCount === nextCount &&
    prevIcon === nextIcon &&
    prevIsOwnReaction === nextIsOwnReaction
  );
};

export const ReactionItem = React.memo(
  ({ count, Icon, isOwnReaction, onPress }) => {
    const theme = useTheme();
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.reactionItemContainer,
          {
            backgroundColor: isOwnReaction
              ? `${theme.blue[900]}55`
              : theme.gray[800],

            borderColor: isOwnReaction ? `${theme.blue[600]}` : "transparent",
          },
        ]}
      >
        <Text
          style={[
            styles.reactionItem,
            {
              color: "#CFD4D2",
            },
          ]}
        >
          {Icon} {count}
        </Text>
      </TouchableOpacity>
    );
  },
  areEqual
);
