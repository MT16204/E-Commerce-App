import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts";
import ProductsGrid from "@/components/ProductsGrid";
import { FocusAwareStatusBar } from "@/components/StatusBar";
import FilterModal, {
  FilterModalRef,
  FilterData,
} from "@/components/FilterModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RECENT_SEARCH_KEY = "@recent_searches";

const SearchScreen = () => {
  const filterModalRef = useRef<FilterModalRef>(null);
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterData | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const { data: products, isLoading } = useProducts();

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
      if (jsonValue != null) {
        setRecentSearches(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Cannot Load Recent Search:", e);
    }
  };

  const saveRecentSearches = async (newList: string[]) => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error("Cannot Save Recent Search:", e);
    }
  };

  const handleSearchSubmit = (searchQuery?: string) => {
    const targetQuery = searchQuery !== undefined ? searchQuery : query;
    const trimmedQuery = targetQuery.trim();

    if (trimmedQuery) {
      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (item) => item.toLowerCase() !== trimmedQuery.toLowerCase(),
        );
        const updatedList = [trimmedQuery, ...filtered].slice(0, 10);
        saveRecentSearches(updatedList);
        return updatedList;
      });
      setIsSearched(true); 
      Keyboard.dismiss();
    }
  };

  const removeRecentItem = (text: string) => {
    const updatedList = recentSearches.filter((item) => item !== text);
    setRecentSearches(updatedList);
    saveRecentSearches(updatedList);
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    AsyncStorage.removeItem(RECENT_SEARCH_KEY);
  };

  const filteredProducts = useMemo(() => {
    if (!products || !isSearched) return [];

    let result = [...products];
    const searchTerm = query.trim().toLowerCase();

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          (p.category && p.category.toLowerCase().includes(searchTerm)),
      );
    }

    if (activeFilters) {
      if (activeFilters.category !== "All") {
        result = result.filter((p) => p.category === activeFilters.category);
      }

      result = result.filter(
        (p) =>
          p.price >= activeFilters.priceRange[0] &&
          p.price <= activeFilters.priceRange[1],
      );

      if (activeFilters.rating !== "All") {
        const minStar = parseInt(activeFilters.rating);
        result = result.filter((p) => (p.averageRating || 0) >= minStar);
      }

      switch (activeFilters.sortBy) {
        case "Price High":
          result.sort((a, b) => b.price - a.price);
          break;
        case "Price Low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "Popular":
          result.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
          break;
        case "Most Recent":
          result.reverse();
          break;
      }
    }
    return result;
  }, [isSearched, query, products, activeFilters]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeScreen style={styles.container}>
        <FocusAwareStatusBar style="dark" />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            <View style={styles.searchBox}>
              <Octicons name="search" size={18} color={theme.colors.grayMedium} />
              <TextInput
                style={styles.input}
                placeholder="Search..."
                autoFocus
                value={query}
                onChangeText={(text) => {
                  setQuery(text);
                  if (text === "") setIsSearched(false); 
                }}
                placeholderTextColor={theme.colors.textPlaceholder}
                returnKeyType="search"
                onSubmitEditing={() => handleSearchSubmit()}
              />
              <TouchableOpacity
                onPress={() => filterModalRef.current?.expand()}
              >
                <Octicons
                  name="sliders"
                  size={18}
                  color={activeFilters ? theme.colors.primary : theme.colors.black}
                />
              </TouchableOpacity>
            </View>
          </View>

          {!isSearched ? (
            <View style={styles.recentBox}>
              <View style={styles.recentHeader}>
                <Text style={styles.boldText}>Recent</Text>
                {recentSearches.length > 0 && (
                  <TouchableOpacity onPress={clearAllRecent}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.divider} />
              <ScrollView showsVerticalScrollIndicator={false}>
                {recentSearches.map((item) => (
                  <View key={item} style={styles.recentItem}>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        setQuery(item);
                        handleSearchSubmit(item);
                      }}
                    >
                      <Text style={styles.recentText}>{item}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeRecentItem(item)}>
                      <Ionicons
                        name="close-circle-outline"
                        size={20}
                        color={theme.colors.textPlaceholder}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {filteredProducts.length > 0 ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.resultsScroll}
                >
                  <View style={styles.resultHeaderRow}>
                    <Text style={styles.resultCount}>
                      Results for "{query}"
                    </Text>
                    <Text style={styles.foundText}>
                      {filteredProducts.length} found
                    </Text>
                  </View>
                  <ProductsGrid
                    products={filteredProducts}
                    isLoading={isLoading}
                    isError={false}
                  />
                </ScrollView>
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={80} color={theme.colors.surfaceVariant} />
                  <Text style={styles.emptyTitle}>Not Found</Text>
                  <Text style={styles.emptySub}>
                    Check your spelling or filters.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </SafeScreen>

      <FilterModal
        ref={filterModalRef}
        onApply={(data) => {
          setActiveFilters(data);
          setIsSearched(true);
        }}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundhome},
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    gap: scale(12),
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 25,
    paddingHorizontal: scale(15),
    height: verticalScale(45),
  },
  input: {
    flex: 1,
    marginLeft: scale(10),
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: "#000000",
  },
  recentBox: { paddingHorizontal: scale(16), marginTop: verticalScale(15) },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  boldText: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: "#272727",
  },
  clearAllText: {
    fontSize: 15,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
    marginBottom: verticalScale(5),
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(15),
  },
  recentText: {
    fontSize: 16,
    color: theme.colors.grayMedium,
    fontFamily: theme.fonts.medium,
  },
  resultsScroll: { paddingHorizontal: scale(16), paddingBottom: 100 },
  resultHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: verticalScale(15),
  },
  resultCount: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
  },
  foundText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontFamily: theme.fonts.semiBold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(40),
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: "#272727",
    marginTop: 15,
  },
  emptySub: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    marginTop: 8,
  },
});

export default SearchScreen;
