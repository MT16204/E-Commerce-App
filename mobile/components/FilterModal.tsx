import React, { useCallback, useMemo, forwardRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Ionicons } from "@expo/vector-icons";
import theme, { scale, verticalScale } from "@/theme";

const CATEGORIES = [
  "All",
  "Sports",
  "Furniture",
  "Electronics",
  "Books",
  "Fashion",
  "Shoes",
  "Cosmetics",
];
const RATINGS = ["All", "5", "4", "3", "2", "1"];

export interface FilterData {
  category: string;
  priceRange: number[];
  sortBy: string;
  rating: string;
}

interface FilterModalProps {
  onApply: (data: FilterData) => void;
}

export type FilterModalRef = BottomSheet;

const FilterModal = forwardRef<FilterModalRef, FilterModalProps>(
  ({ onApply }, ref) => {
    const snapPoints = useMemo(() => ["75%"], []);

    const [selectedCat, setSelectedCat] = useState("All");
    const [priceRange, setPriceRange] = useState([100, 650]);
    const [displayPrice, setDisplayPrice] = useState([100, 650]);
    const [sortBy, setSortBy] = useState("Most Recent");
    const [rating, setRating] = useState("4");

    const [isSliderActive, setIsSliderActive] = useState(false);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );
    const handleValuesChangeStart = useCallback(() => {
      setIsSliderActive(true);
    }, []);

    const handleValuesChange = useCallback((values: number[]) => {
      setDisplayPrice(values);
    }, []);

    const handleValuesChangeFinish = useCallback((values: number[]) => {
      setPriceRange(values);
      setIsSliderActive(false);
    }, []);

    const handleReset = () => {
      setSelectedCat("All");
      setPriceRange([0, 1000]);
      setDisplayPrice([0, 1000]);
      setSortBy("Popular");
      setRating("All");
    };

    const handleApply = () => {
      onApply({
        category: selectedCat,
        priceRange,
        sortBy,
        rating,
      });
      (ref as any).current?.close();
    };

    const FilterSection = ({ title, data, selectedValue, onSelect }: any) => (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {data.map((item: string) => {
            const isSelected = selectedValue === item;
            const isRating = title === "Rating";
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => onSelect(item)}
              >
                {isRating && item !== "All" && (
                  <Ionicons
                    name="star"
                    size={14}
                    color={
                      isSelected ? theme.colors.yellow : theme.colors.black
                    }
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={!isSliderActive}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        enableContentPanningGesture={!isSliderActive}
        enableHandlePanningGesture={!isSliderActive}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.surfaceVariant,
          width: scale(40),
        }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View style={styles.headerWrapper}>
            <Text style={styles.mainTitle}>Sort & Filter</Text>
            <View style={styles.divider} />
          </View>

          <BottomSheetScrollView
            contentContainerStyle={styles.scrollContent}
            scrollEnabled={!isSliderActive}
          >
            <FilterSection
              title="Categories"
              data={CATEGORIES}
              selectedValue={selectedCat}
              onSelect={setSelectedCat}
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.sliderWrapper}>
                <View style={styles.chartContainer}>
                  {[
                    1, 2, 4, 3, 5, 8, 4, 6, 9, 3, 5, 2, 8, 4, 3, 7, 2, 6, 5, 8,
                    4, 6, 9, 3, 5, 2, 8, 4, 3, 7, 2, 6,
                  ].map((h, i) => (
                    <View
                      key={i}
                      style={[styles.chartBar, { height: h * 4 }]}
                    />
                  ))}
                </View>
                <MultiSlider
                  values={priceRange}
                  sliderLength={scale(310)}
                  min={0}
                  max={1000}
                  step={1}
                  allowOverlap={false}
                  snapped={false}
                  onValuesChangeStart={handleValuesChangeStart}
                  onValuesChange={handleValuesChange}
                  onValuesChangeFinish={handleValuesChangeFinish}
                  selectedStyle={{
                    backgroundColor: theme.colors.black,
                    height: 4,
                  }}
                  trackStyle={{
                    backgroundColor: theme.colors.surface,
                    height: 4,
                  }}
                  markerStyle={styles.marker}
                  touchDimensions={{
                    height: 100,
                    width: 100,
                    borderRadius: 25,
                    slipDisplacement: 40,
                  }}
                />
                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>${displayPrice[0]}</Text>
                  <Text style={styles.priceText}>${displayPrice[1]}</Text>
                </View>
              </View>
            </View>

            <FilterSection
              title="Rating"
              data={RATINGS}
              selectedValue={rating}
              onSelect={setRating}
            />
          </BottomSheetScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

FilterModal.displayName = "FilterModal";

const styles = StyleSheet.create({
  headerWrapper: { paddingHorizontal: scale(20) },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  mainTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.semiBold,
    textAlign: "center",
    marginVertical: verticalScale(15),
    color: theme.colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
    marginBottom: 15,
  },
  section: { marginBottom: verticalScale(20) },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    marginBottom: verticalScale(20),
    color: theme.colors.black,
  },
  chipContainer: { gap: scale(10) },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    marginRight: scale(2),
  },
  chipSelected: { backgroundColor: theme.colors.primary },
  chipText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.black,
  },
  chipTextSelected: { color: theme.colors.white },
  sliderWrapper: { alignItems: "center", marginTop: 15 },
  marker: {
    backgroundColor: theme.colors.white,
    borderWidth: 3,
    borderColor: theme.colors.black,
    height: 24,
    width: 24,
    borderRadius: 12,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  priceText: { fontSize: 13, fontFamily: theme.fonts.medium },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    position: "absolute",
    top: -10,
    opacity: 0.2,
  },
  chartBar: {
    width: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  footer: {
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceVariant,
    backgroundColor: theme.colors.white,
  },
  resetBtn: {
    flex: 1,
    height: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
  },
  applyBtn: {
    flex: 1,
    height: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  resetBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  applyBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
});

export default FilterModal;
