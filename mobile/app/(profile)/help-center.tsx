import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import {
  Ionicons,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import { FocusAwareStatusBar } from "@/components/StatusBar";
import ScreenHeader from "@/components/ScreenHeader";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CATEGORIES = ["General", "Account", "Service", "Payment"];

const FAQ_DATA = [
  {
    id: "1",
    category: "General",
    question: "What is Nova?",
    answer:
      "Nova is a premium e-commerce platform providing the latest fashion and electronics with top-tier quality.",
  },
  {
    id: "2",
    category: "General",
    question: "How to use Nova?",
    answer:
      "Simply browse products, add them to your cart, and follow the checkout process. You can track your orders in the 'My Orders' section.",
  },
  {
    id: "3",
    category: "General",
    question: "Is Nova free to use?",
    answer:
      "Yes, downloading and browsing is free. You only pay for the products you purchase and shipping fees.",
  },
  {
    id: "4",
    category: "Account",
    question: "How do I change my password?",
    answer:
      "Go to Profile > Privacy & Security > Change Password to update your credentials securely.",
  },
  {
    id: "5",
    category: "Account",
    question: "How to add promo on Nova?",
    answer:
      "You can enter your promo code at the checkout screen before confirming your payment.",
  },
  {
    id: "6",
    category: "Service",
    question: "How do I cancel a orders product?",
    answer:
      "Go to 'My Orders', select the order, and click 'Cancel' if the order status is still 'Processing'.",
  },
  {
    id: "7",
    category: "Service",
    question: "Why are the my shipping prices different?",
    answer:
      "Shipping prices vary based on your location, weight of the package, and the delivery method selected.",
  },
  {
    id: "8",
    category: "Payment",
    question: "Why did my payment didn't working?",
    answer:
      "Check your balance, card expiration date, or contact your bank. Ensure your internet connection is stable.",
  },
  {
    id: "9",
    category: "Payment",
    question: "Why I can't add a new payment method?",
    answer:
      "We support Visa, Mastercard, and PayPal. Ensure your card is enabled for international transactions.",
  },
];

const CONTACT_CHANNELS = [
  {
    id: "1",
    title: "Customer Service",
    icon: "headset",
    library: "MaterialCommunityIcons",
  },
  {
    id: "2",
    title: "WhatsApp",
    icon: "whatsapp",
    library: "MaterialCommunityIcons",
  },
  {
    id: "3",
    title: "Website",
    icon: "earth",
    library: "MaterialCommunityIcons",
  },
  {
    id: "4",
    title: "Facebook",
    icon: "facebook",
    library: "MaterialCommunityIcons",
  },
  {
    id: "5",
    title: "Twitter",
    icon: "twitter",
    library: "MaterialCommunityIcons",
  },
  {
    id: "6",
    title: "Instagram",
    icon: "instagram",
    library: "MaterialCommunityIcons",
  },
];

const HelpCenterScreen = () => {
  const [activeTab, setActiveTab] = useState("FAQ");
  const [activeCategory, setActiveCategory] = useState("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const displayFaqs = FAQ_DATA.filter((item) => {
    if (activeCategory === "General") return true;
    return item.category === activeCategory; 
  });

  const searchedFaqs = FAQ_DATA.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredFaqs = FAQ_DATA.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectSearchResult = (item: (typeof FAQ_DATA)[0]) => {
    setSearchQuery("");
    setActiveCategory(item.category);
    setTimeout(() => {
      toggleExpand(item.id);
    }, 100);
  };

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />
      <ScreenHeader title="Help Center" />

      {/* TABS */}
      <View style={styles.tabBar}>
        {["FAQ", "Contact us"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "FAQ" ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    activeCategory === cat && styles.activeChip,
                  ]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      activeCategory === cat && styles.activeChipText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.searchWrapper}>
              <View
                style={[
                  styles.searchBar,
                  searchQuery.length > 0 && styles.searchBarActive,
                ]}
              >
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={theme.colors.grayMedium}
                />
                <TextInput
                  placeholder="Search"
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={theme.colors.grayMedium}
                />
              </View>
            </View>

            {searchQuery.length > 0 ? (
              <View style={styles.searchResultContainer}>
                {filteredFaqs.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.searchResultItem}
                    onPress={() => handleSelectSearchResult(item)}
                  >
                    <Text style={styles.searchResultText}>{item.question}</Text>
                    {index < filteredFaqs.length - 1 && (
                      <View style={styles.searchDivider} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.faqList}>
                {displayFaqs.map((item) => (
                  <View key={item.id} style={styles.accordionItem}>
                    <TouchableOpacity
                      style={styles.accordionHeader}
                      onPress={() => toggleExpand(item.id)}
                    >
                      <Text style={styles.questionText}>{item.question}</Text>
                      <Ionicons
                        name={
                          expandedId === item.id ? "caret-up" : "caret-down"
                        }
                        size={20}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>
                    {expandedId === item.id && (
                      <View style={styles.accordionBody}>
                        <View style={styles.divider} />
                        <Text style={styles.answerText}>{item.answer}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.contactList}>
            {CONTACT_CHANNELS.map((channel) => (
              <TouchableOpacity key={channel.id} style={styles.contactCard}>
                <View style={styles.contactIconWrapper}>
                  {channel.library === "Feather" && (
                    <Feather
                      name={channel.icon as any}
                      size={22}
                      color={theme.colors.black}
                    />
                  )}
                  {channel.library === "FontAwesome5" && (
                    <FontAwesome5
                      name={channel.icon}
                      size={22}
                      color={theme.colors.black}
                    />
                  )}
                  {channel.library === "MaterialCommunityIcons" && (
                    <MaterialCommunityIcons
                      name={channel.icon as any}
                      size={24}
                      color={theme.colors.black}
                    />
                  )}
                </View>
                <Text style={styles.contactTitle}>{channel.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundhome },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
    marginHorizontal: scale(20),
  },
  tabItem: {
    flex: 1,
    paddingVertical: verticalScale(15),
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTabItem: { borderBottomColor: theme.colors.primary },
  tabText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.grayMedium,
  },
  activeTabText: { color: theme.colors.black },

  scrollContent: { paddingBottom: verticalScale(30) },
  categoryContainer: {
    paddingLeft: scale(20),
    marginVertical: verticalScale(20),
  },
  chip: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginRight: scale(10),
  },
  activeChip: { backgroundColor: theme.colors.primary },
  chipText: { fontFamily: theme.fonts.medium, color: theme.colors.black },
  activeChipText: { color: theme.colors.white },

  searchWrapper: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(10),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: scale(15),
    paddingHorizontal: scale(15),
    height: verticalScale(55),
  },
  searchBarActive: {
    borderWidth: 1.5,
    borderColor: theme.colors.black,
    backgroundColor: theme.colors.white,
  },
  searchInput: {
    flex: 1,
    marginLeft: scale(10),
    fontFamily: theme.fonts.regular,
    fontSize: 15,
  },
  searchResultContainer: {
    marginHorizontal: scale(20),
    backgroundColor: theme.colors.white,
    borderRadius: scale(20),
    padding: scale(15),
  },
  searchResultItem: { paddingVertical: verticalScale(15) },
  searchResultText: {
    fontSize: 15,
    fontFamily: theme.fonts.medium,
    color: theme.colors.heading,
  },
  searchDivider: {
    height: 1,
    backgroundColor: theme.colors.surface,
    marginTop: verticalScale(15),
  },
  faqList: { paddingHorizontal: scale(20), marginTop: verticalScale(10) },
  accordionItem: {
    backgroundColor: theme.colors.white,
    borderRadius: scale(20),
    marginBottom: verticalScale(15),
    padding: scale(18),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.black,
    flex: 1,
  },
  accordionBody: { marginTop: verticalScale(12), overflow: "hidden" },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surface,
    marginBottom: verticalScale(12),
  },
  answerText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  contactList: { paddingHorizontal: scale(20), marginTop: verticalScale(20) },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    padding: scale(20),
    borderRadius: scale(20),
    marginBottom: verticalScale(15),
    elevation: 2,
  },
  contactIconWrapper: { width: scale(30), alignItems: "center" },
  contactTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    marginLeft: scale(15),
    color: theme.colors.black,
  },
});

export default HelpCenterScreen;
