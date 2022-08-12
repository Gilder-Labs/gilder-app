import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import type { CircleProps, Color, StopProps } from "react-native-svg";
import { vh, vw, IconProps } from "stream-chat-expo";
import { darkTheme } from "./Theme";

export const DEFAULT_STATUS_ICON_SIZE = 16;
const maxWidth = vw(100) - 72;

export const Colors = {
  accent_blue: darkTheme.blue[500],
  accent_green: darkTheme.success[500],
  accent_red: darkTheme.error[500],
  bg_gradient_end: darkTheme.gray[700],
  bg_gradient_start: darkTheme.gray[900],
  black: darkTheme.gray[50],
  blue_alice: darkTheme.gray[800],
  border: darkTheme.gray[800],
  grey: darkTheme.gray[500],
  grey_gainsboro: darkTheme.gray[800], // message color
  grey_whisper: darkTheme.gray[800], // border color on input
  icon_background: darkTheme.gray[500],
  modal_shadow: "#000000",
  overlay: `${darkTheme.gray[700]}88`, // overlay color when long press
  shadow_icon: `${darkTheme.gray[700]}88`,
  targetedMessageBackground: "#302D22",
  transparent: "transparent",
  white: darkTheme.gray[1000], // text input background and icon
  white_smoke: darkTheme.gray[1000], // ?
  white_snow: darkTheme.gray[900], // message list background
};

export type MarkdownStyle = Partial<{
  autolink: TextStyle;
  blockQuoteBar: ViewStyle;
  blockQuoteSection: ViewStyle;
  blockQuoteSectionBar: ViewStyle;
  blockQuoteText: TextStyle | ViewStyle;
  br: TextStyle;
  codeBlock: TextStyle;
  del: TextStyle;
  em: TextStyle;
  heading: TextStyle;
  heading1: TextStyle;
  heading2: TextStyle;
  heading3: TextStyle;
  heading4: TextStyle;
  heading5: TextStyle;
  heading6: TextStyle;
  hr: ViewStyle;
  image: ImageStyle;
  inlineCode: TextStyle;
  list: ViewStyle;
  listItem: ViewStyle;
  listItemBullet: TextStyle;
  listItemNumber: TextStyle;
  listItemText: TextStyle;
  listRow: ViewStyle;
  mailTo: TextStyle;
  mentions: TextStyle;
  newline: TextStyle;
  noMargin: TextStyle;
  paragraph: TextStyle;
  paragraphCenter: TextStyle;
  paragraphWithImage: ViewStyle;
  strong: TextStyle;
  sublist: ViewStyle;
  table: ViewStyle;
  tableHeader: ViewStyle;
  tableHeaderCell: TextStyle;
  tableRow: ViewStyle;
  tableRowCell: ViewStyle;
  tableRowLast: ViewStyle;
  text: TextStyle;
  u: TextStyle;
  view: ViewStyle;
}>;

export type Theme = {
  attachmentPicker: {
    bottomSheetContentContainer: ViewStyle;
    durationText: TextStyle;
    errorButtonText: TextStyle;
    errorContainer: ViewStyle;
    errorText: TextStyle;
    image: ViewStyle;
    imageOverlay: ViewStyle;
    imageOverlaySelectedComponent: {
      check: ViewStyle;
    };
  };
  attachmentSelectionBar: {
    container: ViewStyle;
    icon: ViewStyle;
  };
  avatar: {
    BASE_AVATAR_SIZE: number;
    container: ViewStyle;
    image: ImageStyle;
    presenceIndicator: CircleProps;
    presenceIndicatorContainer: ViewStyle;
  };
  channel: {
    selectChannel: TextStyle;
  };
  channelListFooterLoadingIndicator: {
    container: ViewStyle;
  };
  channelListHeaderErrorIndicator: {
    container: ViewStyle;
    errorText: TextStyle;
  };
  channelListLoadingIndicator: {
    container: ViewStyle;
  };
  channelListMessenger: {
    flatList: ViewStyle;
    flatListContent: ViewStyle;
  };
  channelListSkeleton: {
    animationTime: number;
    background: ViewStyle;
    container: ViewStyle;
    gradientStart: StopProps;
    gradientStop: StopProps;
    height: number;
    maskFillColor?: Color;
  };
  channelPreview: {
    checkAllIcon: IconProps;
    checkIcon: IconProps;
    container: ViewStyle;
    contentContainer: ViewStyle;
    date: TextStyle;
    message: TextStyle & {
      fontWeight: TextStyle["fontWeight"];
    };
    mutedStatus: {
      height: number;
      iconStyle: ViewStyle;
      width: number;
    };
    row: ViewStyle;
    title: TextStyle;
    unreadContainer: ViewStyle;
    unreadText: TextStyle;
  };
  colors: typeof Colors & { [key: string]: string };
  dateHeader: {
    container: ViewStyle;
    text: TextStyle;
  };
  emptyStateIndicator: {
    channelContainer: ViewStyle;
    channelDetails: TextStyle;
    channelTitle: TextStyle;
  };
  groupAvatar: {
    container: ViewStyle;
    image: ImageStyle;
  };
  iconBadge: {
    icon: ViewStyle;
    iconInner: ViewStyle;
    unreadCount: TextStyle;
  };
  iconSquare: {
    container: ViewStyle;
    image: ImageStyle;
  };
  imageGallery: {
    footer: {
      centerContainer: ViewStyle;
      container: ViewStyle;
      imageCountText: TextStyle;
      innerContainer: ViewStyle;
      leftContainer: ViewStyle;
      rightContainer: ViewStyle;
    };
    grid: {
      contentContainer: ViewStyle;
      gridAvatar: ImageStyle;
      gridAvatarWrapper: ViewStyle;
      gridImage: ViewStyle;
      handle: ViewStyle;
      handleText: TextStyle;
      overlay: ViewStyle;
    };
    header: {
      centerContainer: ViewStyle;
      container: ViewStyle;
      dateText: TextStyle;
      innerContainer: ViewStyle;
      leftContainer: ViewStyle;
      rightContainer: ViewStyle;
      usernameText: TextStyle;
    };
    videoControl: {
      durationTextStyle: TextStyle;
      roundedView: ViewStyle;
      videoContainer: ViewStyle;
    };
    backgroundColor?: string;
    pager?: ViewStyle;
    slide?: ImageStyle;
  };
  inlineDateSeparator: {
    container: ViewStyle;
    text: TextStyle;
  };
  loadingDots: {
    container: ViewStyle;
    loadingDot: ViewStyle;
    spacing: number;
  };
  loadingErrorIndicator: {
    container: ViewStyle;
    errorText: TextStyle;
    retryText: TextStyle;
  };
  loadingIndicator: {
    container: ViewStyle;
    loadingText: TextStyle;
  };
  messageInput: {
    attachButton: ViewStyle;
    attachButtonContainer: ViewStyle;
    attachmentSelectionBar: ViewStyle;
    autoCompleteInputContainer: ViewStyle;
    commandsButton: ViewStyle;
    commandsButtonContainer: ViewStyle;
    composerContainer: ViewStyle;
    container: ViewStyle;
    cooldownTimer: {
      container: ViewStyle;
      text: TextStyle;
    };
    editingBoxContainer: ViewStyle;
    editingBoxHeader: ViewStyle;
    editingBoxHeaderTitle: TextStyle;
    editingStateHeader: {
      editingBoxHeader: ViewStyle;
      editingBoxHeaderTitle: TextStyle;
    };
    fileUploadPreview: {
      dismiss: ViewStyle;
      fileContainer: ViewStyle;
      fileContentContainer: ViewStyle;
      filenameText: TextStyle;
      fileSizeText: TextStyle;
      fileTextContainer: ViewStyle;
      flatList: ViewStyle;
    };
    giphyCommandInput: {
      giphyContainer: ViewStyle;
      giphyText: TextStyle;
    };
    imageUploadPreview: {
      dismiss: ViewStyle;
      flatList: ViewStyle;
      itemContainer: ViewStyle;
      upload: ImageStyle;
    };
    inputBox: TextStyle;
    inputBoxContainer: ViewStyle;
    moreOptionsButton: ViewStyle;
    optionsContainer: ViewStyle;
    replyContainer: ViewStyle;
    sendButton: ViewStyle;
    sendButtonContainer: ViewStyle;
    sendMessageDisallowedIndicator: {
      container: ViewStyle;
      text: TextStyle;
    };
    showThreadMessageInChannelButton: {
      check: IconProps;
      checkBoxActive: ViewStyle;
      checkBoxInactive: ViewStyle;
      container: ViewStyle;
      innerContainer: ViewStyle;
      text: TextStyle;
    };
    suggestions: {
      command: {
        args: TextStyle;
        container: ViewStyle;
        iconContainer: ViewStyle;
        title: TextStyle;
      };
      container: ViewStyle & {
        maxHeight: number;
      };
      emoji: {
        container: ViewStyle;
        text: TextStyle;
      };
      header: {
        container: ViewStyle;
        title: TextStyle;
      };
      item: ViewStyle;
      mention: {
        avatarSize: number;
        column: ViewStyle;
        container: ViewStyle;
        name: TextStyle;
        tag: TextStyle;
      };
    };
    suggestionsListContainer: {
      container: ViewStyle;
      flatlist: ViewStyle;
    };
    uploadProgressIndicator: {
      container: ViewStyle;
      overlay: ViewStyle;
    };
  };
  messageList: {
    container: ViewStyle;
    contentContainer: ViewStyle;
    errorNotification: ViewStyle;
    errorNotificationText: TextStyle;
    inlineUnreadIndicator: {
      container: ViewStyle;
      text: TextStyle;
    };
    listContainer: ViewStyle;
    messageSystem: {
      container: ViewStyle;
      dateText: TextStyle;
      line: ViewStyle;
      text: TextStyle;
      textContainer: ViewStyle;
    };
    scrollToBottomButton: {
      container: ViewStyle;
      touchable: ViewStyle;
      unreadCountNotificationContainer: ViewStyle;
      unreadCountNotificationText: TextStyle;
      wrapper: ViewStyle;
      chevronColor?: Color;
    };
    typingIndicatorContainer: ViewStyle;
  };
  messageSimple: {
    actions: {
      button: ViewStyle & {
        defaultBackgroundColor?: ViewStyle["backgroundColor"];
        defaultBorderColor?: ViewStyle["borderColor"];
        primaryBackgroundColor?: ViewStyle["backgroundColor"];
        primaryBorderColor?: ViewStyle["borderColor"];
      };
      buttonText: TextStyle & {
        defaultColor?: TextStyle["color"];
        primaryColor?: TextStyle["color"];
      };
      container: ViewStyle;
    };
    avatarWrapper: {
      container: ViewStyle;
      leftAlign: ViewStyle;
      rightAlign: ViewStyle;
      spacer: ViewStyle;
    };
    card: {
      authorName: TextStyle;
      authorNameContainer: ViewStyle;
      authorNameFooter: TextStyle;
      authorNameFooterContainer: ViewStyle;
      authorNameMask: ViewStyle;
      container: ViewStyle;
      cover: ImageStyle;
      footer: ViewStyle & {
        description: TextStyle;
        title: TextStyle;
      };
      noURI: ViewStyle;
    };
    container: ViewStyle;
    content: {
      container: ViewStyle & {
        borderRadiusL: ViewStyle[
          | "borderBottomLeftRadius"
          | "borderTopLeftRadius"];
        borderRadiusS: ViewStyle[
          | "borderBottomRightRadius"
          | "borderTopRightRadius"];
      };
      containerInner: ViewStyle;
      deletedContainer: ViewStyle;
      deletedContainerInner: ViewStyle;
      deletedMetaText: TextStyle;
      deletedText: MarkdownStyle;
      errorContainer: ViewStyle;
      errorIcon: IconProps;
      errorIconContainer: ViewStyle;
      eyeIcon: IconProps;
      /**
       * Available options for styling text:
       * https://github.com/andangrd/react-native-markdown-package/blob/main/styles.js
       */
      markdown: MarkdownStyle;
      messageUser: TextStyle;
      metaContainer: ViewStyle;
      metaText: TextStyle;
      replyBorder: ViewStyle;
      replyContainer: ViewStyle;
      textContainer: ViewStyle & {
        onlyEmojiMarkdown: MarkdownStyle;
      };
      wrapper: ViewStyle;
    };
    file: {
      container: ViewStyle;
      details: ViewStyle;
      fileSize: TextStyle;
      icon: IconProps;
      title: TextStyle;
    };
    fileAttachmentGroup: {
      container: ViewStyle;
    };
    gallery: {
      galleryContainer: ViewStyle;
      galleryItemColumn: ViewStyle;
      gridHeight: number;
      gridWidth: number;
      image: ImageStyle;
      imageContainer: ViewStyle;
      maxHeight: number;
      maxWidth: number;
      minHeight: number;
      minWidth: number;
      moreImagesContainer: ViewStyle;
      moreImagesText: TextStyle;
    };
    giphy: {
      buttonContainer: ViewStyle;
      cancel: TextStyle;
      container: ViewStyle;
      giphy: ImageStyle;
      giphyContainer: ViewStyle;
      giphyHeaderText: TextStyle;
      giphyHeaderTitle: TextStyle;
      giphyMask: ViewStyle;
      giphyMaskText: TextStyle;
      header: ViewStyle;
      selectionContainer: ViewStyle;
      send: TextStyle;
      shuffle: TextStyle;
      title: TextStyle;
    };
    pinnedHeader: {
      container: ViewStyle;
      label: TextStyle;
    };
    reactionList: {
      container: ViewStyle;
      middleIcon: ViewStyle;
      radius: number;
      reactionBubble: ViewStyle;
      reactionBubbleBackground: ViewStyle;
      reactionSize: number;
      strokeSize: number;
    };
    replies: {
      avatar: ViewStyle;
      avatarContainerMultiple: ViewStyle;
      avatarContainerSingle: ViewStyle;
      container: ViewStyle;
      leftAvatarsContainer: ViewStyle;
      leftCurve: ViewStyle;
      messageRepliesText: TextStyle;
      rightAvatarsContainer: ViewStyle;
      rightCurve: ViewStyle;
      avatarSize?: number;
    };
    status: {
      checkAllIcon: IconProps;
      checkIcon: IconProps;
      readByCount: TextStyle;
      statusContainer: ViewStyle;
      timeIcon: IconProps;
    };
    targetedMessageUnderlay: ViewStyle;
    videoThumbnail: {
      container: ViewStyle;
      roundedView: ViewStyle;
    };
  };
  overlay: {
    container: ViewStyle;
    messageActions: {
      actionContainer: ViewStyle;
      icon: ViewStyle;
      title: TextStyle;
    };
    padding: number;
    reactions: {
      avatarContainer: ViewStyle;
      avatarName: TextStyle;
      avatarSize: number;
      container: ViewStyle;
      flatListContainer: ViewStyle;
      radius: number;
      reactionBubble: ViewStyle;
      reactionBubbleBackground: ViewStyle;
      title: TextStyle;
    };
    reactionsList: {
      radius: number;
      reaction: ViewStyle;
      reactionList: ViewStyle;
      reactionSize: number;
    };
  };
  reply: {
    container: ViewStyle;
    fileAttachmentContainer: ViewStyle;
    imageAttachment: ImageStyle;
    markdownStyles: MarkdownStyle;
    messageContainer: ViewStyle;
    textContainer: ViewStyle;
  };
  screenPadding: number;
  spinner: ViewStyle;
  thread: {
    newThread: ViewStyle & {
      text: TextStyle;
      backgroundGradientStart?: string;
      backgroundGradientStop?: string;
    };
  };
  typingIndicator: {
    container: ViewStyle;
    text: TextStyle & {
      fontSize: TextStyle["fontSize"];
    };
  };
};

export const defaultTheme: Theme = {
  attachmentPicker: {
    bottomSheetContentContainer: {},
    durationText: {},
    errorButtonText: {},
    errorContainer: {},
    errorText: {},
    image: {},
    imageOverlay: {},
    imageOverlaySelectedComponent: {
      check: {},
    },
  },
  attachmentSelectionBar: {
    container: {},
    icon: {},
  },
  avatar: {
    BASE_AVATAR_SIZE: 32,
    container: {},
    image: {
      borderRadius: 16,
      height: 32,
      width: 32,
    },
    presenceIndicator: {
      cx: 6,
      cy: 6,
      r: 5,
      strokeWidth: 2,
    },
    presenceIndicatorContainer: {},
  },
  channel: {
    selectChannel: {},
  },
  channelListFooterLoadingIndicator: {
    container: {},
  },
  channelListHeaderErrorIndicator: {
    container: {},
    errorText: {},
  },
  channelListLoadingIndicator: {
    container: {},
  },
  channelListMessenger: {
    flatList: {},
    flatListContent: {},
  },
  channelListSkeleton: {
    animationTime: 1800, // in milliseconds
    background: {},
    container: {},
    gradientStart: {
      stopOpacity: 0,
    },
    gradientStop: {
      stopOpacity: 0.5,
    },
    height: 64,
  },
  channelPreview: {
    checkAllIcon: {
      height: DEFAULT_STATUS_ICON_SIZE,
      width: DEFAULT_STATUS_ICON_SIZE,
    },
    checkIcon: {
      height: DEFAULT_STATUS_ICON_SIZE,
      width: DEFAULT_STATUS_ICON_SIZE,
    },
    container: {},
    contentContainer: {},
    date: {},
    message: {
      fontWeight: "400",
    },
    mutedStatus: {
      height: 20,
      iconStyle: {},
      width: 20,
    },
    row: {},
    title: {},
    unreadContainer: {},
    unreadText: {},
  },
  colors: {
    ...Colors,
  },
  dateHeader: {
    container: {
      backgroundColor: darkTheme.gray[800],
    },
    text: {
      color: darkTheme.gray[400],
    },
  },
  emptyStateIndicator: {
    channelContainer: {},
    channelDetails: {},
    channelTitle: {},
  },
  groupAvatar: {
    container: {},
    image: {
      resizeMode: "cover",
    },
  },
  iconBadge: {
    icon: {},
    iconInner: {},
    unreadCount: {},
  },
  iconSquare: {
    container: {},
    image: {},
  },
  imageGallery: {
    footer: {
      centerContainer: {},
      container: {},
      imageCountText: {},
      innerContainer: {},
      leftContainer: {},
      rightContainer: {},
    },
    grid: {
      contentContainer: {},
      gridAvatar: {},
      gridAvatarWrapper: {},
      gridImage: {},
      handle: {},
      handleText: {},
      overlay: {},
    },
    header: {
      centerContainer: {},
      container: {},
      dateText: {},
      innerContainer: {},
      leftContainer: {},
      rightContainer: {},
      usernameText: {},
    },
    videoControl: {
      durationTextStyle: {},
      roundedView: {},
      videoContainer: {},
    },
  },
  inlineDateSeparator: {
    container: {
      backgroundColor: darkTheme.gray[800],
    },
    text: {
      color: darkTheme.gray[400],
    },
  },
  loadingDots: {
    container: {},
    loadingDot: {},
    spacing: 4,
  },
  loadingErrorIndicator: {
    container: {},
    errorText: {},
    retryText: {},
  },
  loadingIndicator: {
    container: {},
    loadingText: {},
  },
  messageInput: {
    attachButton: {},
    attachButtonContainer: {},
    attachmentSelectionBar: {},
    autoCompleteInputContainer: {},
    commandsButton: {},
    commandsButtonContainer: {},
    composerContainer: {},
    container: {},
    cooldownTimer: {
      container: {},
      text: {},
    },
    editingBoxContainer: {},
    editingBoxHeader: {},
    editingBoxHeaderTitle: {},
    editingStateHeader: {
      editingBoxHeader: {},
      editingBoxHeaderTitle: {},
    },
    fileUploadPreview: {
      dismiss: {},
      fileContainer: {},
      fileContentContainer: {},
      filenameText: {},
      fileSizeText: {},
      fileTextContainer: {},
      flatList: {},
    },
    giphyCommandInput: {
      giphyContainer: {},
      giphyText: {},
    },
    imageUploadPreview: {
      dismiss: {},
      flatList: {},
      itemContainer: {},
      upload: {},
    },
    inputBox: {
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
    inputBoxContainer: {
      backgroundColor: darkTheme.gray[800],
      borderRadius: 16,
      paddingTop: 0,
      paddingBottom: 0,
      minHeight: 44,
      alignItems: "center",
      alignContent: "center",
      justifyContent: "center",
    },
    moreOptionsButton: {},
    optionsContainer: {},
    replyContainer: {},
    sendButton: {},
    sendButtonContainer: {},
    sendMessageDisallowedIndicator: {
      container: {},
      text: {},
    },
    showThreadMessageInChannelButton: {
      check: {},
      checkBoxActive: {},
      checkBoxInactive: {},
      container: {},
      innerContainer: {},
      text: {},
    },
    suggestions: {
      command: {
        args: {},
        container: {},
        iconContainer: {},
        title: {},
      },
      container: {
        maxHeight: vh(25),
      },
      emoji: {
        container: {},
        text: {},
      },
      header: {
        container: {},
        title: {},
      },
      item: {},
      mention: {
        avatarSize: 40,
        column: {},
        container: {},
        name: {},
        tag: {},
      },
    },
    suggestionsListContainer: {
      container: {},
      flatlist: {},
    },
    uploadProgressIndicator: {
      container: {},
      overlay: {},
    },
  },
  messageList: {
    container: {},
    contentContainer: {},
    errorNotification: {},
    errorNotificationText: {},
    inlineUnreadIndicator: {
      container: {},
      text: {},
    },
    listContainer: {},
    messageSystem: {
      container: {},
      dateText: {},
      line: {},
      text: {},
      textContainer: {},
    },
    scrollToBottomButton: {
      container: {},
      touchable: {},
      unreadCountNotificationContainer: {},
      unreadCountNotificationText: {},
      wrapper: {},
    },
    typingIndicatorContainer: {},
  },
  messageSimple: {
    actions: {
      button: {},
      buttonText: {},
      container: {},
    },
    avatarWrapper: {
      container: {
        alignItems: "flex-start",
        height: "100%",
      },
      leftAlign: {
        marginRight: 8,
      },
      rightAlign: {
        marginLeft: 8,
      },
      spacer: {
        height: 36,
        width: 32, // same as BASE_AVATAR_SIZE
      },
    },
    card: {
      authorName: {},
      authorNameContainer: {},
      authorNameFooter: {},
      authorNameFooterContainer: {},
      authorNameMask: {},
      container: {},
      cover: {},
      footer: {
        description: {},
        title: {
          fontWeight: "700",
        },
      },
      noURI: {
        borderLeftWidth: 2,
        paddingLeft: 8,
      },
    },
    container: {
      width: maxWidth,
    },
    content: {
      container: {
        borderRadiusL: 8,
        borderRadiusS: 8,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
        borderWidth: 0,
        width: maxWidth,
        padding: 0,
        backgroundColor: "transparent",
      },
      containerInner: {
        borderWidth: 0,
        backgroundColor: "transparent",
        borderTopEndRadius: 4,
        borderTopLeftRadius: 4,
      }, // chat styles here
      deletedContainer: {},
      deletedContainerInner: {},
      deletedMetaText: {
        paddingHorizontal: 5,
      },
      deletedText: {
        em: {
          fontSize: 15,
          fontStyle: "italic",
          fontWeight: "400",
        },
      },
      errorContainer: {
        paddingRight: 12,
        paddingTop: 0,
      },
      errorIcon: {
        height: 20,
        width: 20,
      },
      errorIconContainer: {
        bottom: -2,
        position: "absolute",
        right: -12,
      },
      eyeIcon: {
        height: 16,
        width: 16,
      },
      markdown: {
        mentions: {},
      },
      messageUser: {
        fontSize: 12,
        fontWeight: "700",
        padding: 0,
      },
      metaContainer: {
        flexDirection: "row",
        marginTop: 4,
      },
      metaText: {
        fontSize: 12,
      },
      replyBorder: {},
      replyContainer: {},
      textContainer: {
        onlyEmojiMarkdown: { text: { fontSize: 50 } },
        width: maxWidth,
        maxWidth: maxWidth,
        paddingLeft: 0,
        paddingBottom: 0,
        borderRadius: 8,
        borderTopEndRadius: 8,
        borderTopLeftRadius: 8,
        margin: 0,
        marginLeft: 0,
        marginTop: -8,
      },
      wrapper: { width: maxWidth },
    },
    file: {
      container: {
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      details: {},
      fileSize: {},
      icon: {},
      title: {},
    },
    fileAttachmentGroup: {
      container: {
        borderRadius: 4,
      },
    },
    gallery: {
      galleryContainer: {
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      galleryItemColumn: {
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      gridHeight: 195,
      gridWidth: 256,
      image: {
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      imageContainer: {
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      maxHeight: 300,
      maxWidth: maxWidth - 2,
      minHeight: 100,
      minWidth: 170,
      moreImagesContainer: {},
      moreImagesText: {},
    },
    giphy: {
      buttonContainer: {},
      cancel: {},
      container: {
        width: maxWidth,
        paddingTop: 0,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      giphy: { width: maxWidth },
      giphyContainer: {},
      giphyHeaderText: {},
      giphyHeaderTitle: {},
      giphyMask: {
        opacity: 0.0,
      },
      giphyMaskText: {
        color: "white",
      },
      header: {},
      selectionContainer: {
        width: maxWidth,
      },
      send: {},
      shuffle: {},
      title: {},
    },
    pinnedHeader: {
      container: {},
      label: {},
    },
    reactionList: {
      container: {},
      middleIcon: {},
      radius: 2, // not recommended to change this
      reactionBubble: {},
      reactionBubbleBackground: {},
      reactionSize: 24,
      strokeSize: 1, // not recommended to change this
    },
    replies: {
      avatar: {},
      avatarContainerMultiple: {},
      avatarContainerSingle: {},
      container: {},
      leftAvatarsContainer: {},
      leftCurve: {},
      messageRepliesText: {},
      rightAvatarsContainer: {},
      rightCurve: {},
    },
    status: {
      checkAllIcon: {
        height: DEFAULT_STATUS_ICON_SIZE,
        width: DEFAULT_STATUS_ICON_SIZE,
      },
      checkIcon: {
        height: DEFAULT_STATUS_ICON_SIZE,
        width: DEFAULT_STATUS_ICON_SIZE,
      },
      readByCount: {},
      statusContainer: {},
      timeIcon: {
        height: DEFAULT_STATUS_ICON_SIZE,
        width: DEFAULT_STATUS_ICON_SIZE,
      },
    },
    targetedMessageUnderlay: {},
    videoThumbnail: {
      container: {},
      roundedView: {},
    },
  },
  overlay: {
    container: {},
    messageActions: {
      actionContainer: {},
      icon: {},
      title: {},
    },
    padding: 8,
    reactions: {
      avatarContainer: {},
      avatarName: {},
      avatarSize: 64,
      container: {},
      flatListContainer: {},
      radius: 2,
      reactionBubble: {},
      reactionBubbleBackground: {},
      title: {},
    },
    reactionsList: {
      radius: 2.5,
      reaction: {},
      reactionList: {},
      reactionSize: 24,
    },
  },
  reply: {
    container: {},
    fileAttachmentContainer: {},
    imageAttachment: {},
    markdownStyles: {},
    messageContainer: {},
    textContainer: {
      maxWidth: undefined,
      width: undefined,
    },
  },
  screenPadding: 8,
  spinner: {},
  thread: {
    newThread: {
      text: {},
      backgroundGradientStart: darkTheme.gray[900],
      backgroundGradientStop: darkTheme.gray[900],
    },
  },
  typingIndicator: {
    container: {},
    text: {
      fontSize: 14,
    },
  },
};
