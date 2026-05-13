import { BlurView } from "expo-blur";
import { Button, Input, Select } from "heroui-native";
import { StyleSheet, View } from "react-native";

import { Text } from "@/components/Text";
import CURRENCIES from "@/constants/currencies";
import { formatPrice } from "@/lib/formatPrice";
import { OnboardingProps } from "@/types/onboarding.type";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Fragment } from "react";

export default function Salary({ onNext, data, updateData }: OnboardingProps) {
  const handleSalaryChange = (val: string) => {
    const cleanValue = val.replace(/\./g, "");
    if (cleanValue === "" || /^\d+$/.test(cleanValue)) {
      updateData?.({ salary: cleanValue === "" ? 0 : Number(cleanValue) });
    }
  };

  return (
    <View className="flex flex-col items-center flex-1 p-3 justify-between">
      <View className="mt-20 flex flex-col items-center gap-y-16 w-full">
        <Text variant="h1" className="text-center">
          What actually hits your bank?
        </Text>

        <Text variant="p" className="text-center">
          Enter your monthly{" "}
          <Text variant="p" className="font-bold">
            Take-Home Pay
          </Text>
          . Ignore taxes and insurance. Just the cash you can spend.
        </Text>

        <View className="flex flex-row gap-x-5 w-full">
          <Select
            presentation="bottom-sheet"
            value={
              data?.currency
                ? { value: data.currency, label: data.currency }
                : undefined
            }
            onValueChange={(selected) => {
              updateData?.({ currency: selected?.value });
            }}
          >
            <Select.Trigger className="w-28">
              <Select.Value placeholder="Currency" />
              <Select.TriggerIndicator />
            </Select.Trigger>

            <Select.Portal>
              <Select.Overlay className="bg-transparent">
                <BlurView
                  intensity={20}
                  tint="dark"
                  experimentalBlurMethod="dimezisBlurView"
                  style={StyleSheet.absoluteFill}
                />
              </Select.Overlay>
              <Select.Content
                presentation="bottom-sheet"
                snapPoints={["35%", "50%"]}
                enableDynamicSizing={false}
                enableOverDrag={false}
                contentContainerClassName="h-full"
                backgroundStyle={{
                  borderCurve: "continuous",
                }}
                contentContainerProps={{
                  style: {
                    borderCurve: "continuous",
                  },
                }}
              >
                <BottomSheetScrollView showsVerticalScrollIndicator={false}>
                  {CURRENCIES.map((currency) => (
                    <Fragment key={currency.label}>
                      <Select.Item
                        key={currency.label}
                        value={currency.value}
                        label={`${currency.symbol} - ${currency.label}`}
                      />
                    </Fragment>
                  ))}
                </BottomSheetScrollView>
              </Select.Content>
            </Select.Portal>
          </Select>

          <Input
            value={formatPrice(data?.salary)}
            onChangeText={handleSalaryChange}
            className="flex-1 focus:border-primary"
            keyboardType="numeric"
            placeholder="Input your take-home pay"
          />
        </View>
      </View>

      <Button
        onPress={onNext}
        isDisabled={!data?.salary || !data?.currency}
        className="w-full h-14 bg-primary rounded-xl items-center"
        animation={{
					highlight: {
						backgroundColor: {
							value: "#6366f1",
						},
						opacity: {
							value: [0, 0.5],
						},
					},
				}}
      >
        <Text className="text-foreground text-lg font-jakarta">Next</Text>
      </Button>
    </View>
  );
}
