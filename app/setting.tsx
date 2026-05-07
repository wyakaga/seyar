import React, { useCallback, useState, Fragment } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import {
  Card,
  TextField,
  Label,
  Input,
  Select,
  Button,
} from "heroui-native";
import { BlurView } from "expo-blur";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { Text } from "@/components/Text";
import XIcon from "@/components/icons/XIcon";
import { useItemManagement } from "@/hooks/useItemManagement";
import { db } from "@/db/client";
import { items as itemsTable, userSettings } from "@/db/schema";
import { sql } from "drizzle-orm";
import CURRENCIES from "@/constants/currencies";
import { formatPrice } from "@/lib/formatPrice";
import { useErrorService } from "@/hooks/useErrorService";

export default function Setting() {
  const { settings, loadData } = useItemManagement();
  const { handleError } = useErrorService();

  const [salary, setSalary] = useState<string>("");
  const [workDays, setWorkDays] = useState<string>("");
  const [workHours, setWorkHours] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<
    { value: string; label: string } | undefined
  >();

  const [isReady, setIsReady] = useState(false);

  const handleSalaryChange = (val: string) => {
    const cleanValue = val.replace(/\./g, "");
    if (cleanValue === "" || /^\d+$/.test(cleanValue)) {
      setSalary(cleanValue === "" ? "" : parseInt(cleanValue, 10).toString());
    }
  };

  const handleWorkDaysChange = (val: string) => {
    const cleanValue = val.replace(/[^0-9]/g, "");
    if (cleanValue === "") {
      setWorkDays("");
      return;
    }
    const num = parseInt(cleanValue, 10);
    if (num > 31) {
      setWorkDays("31");
    } else {
      setWorkDays(num.toString());
    }
  };

  const handleWorkHoursChange = (val: string) => {
    const cleanValue = val.replace(/[^0-9]/g, "");
    if (cleanValue === "") {
      setWorkHours("");
      return;
    }
    const num = parseInt(cleanValue, 10);
    if (num > 24) {
      setWorkHours("24");
    } else {
      setWorkHours(num.toString());
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  useFocusEffect(useCallback(() => {
    if (settings) {
      setSalary(settings.salary ? settings.salary.toString() : "");
      setWorkDays(
        settings.workDaysPerMonth ? settings.workDaysPerMonth.toString() : "",
      );
      setWorkHours(
        settings.workHoursPerDay ? settings.workHoursPerDay.toString() : "",
      );

      const found = CURRENCIES.find((c) => c.value === settings.currency);
      if (found) {
        setSelectedCurrency({
          value: found.value,
          label: `${found.value} - ${found.label} (${found.symbol})`,
        });
      }
      
      setIsReady(true);
    }
  }, [settings]));

  const handleUpdate = async () => {
    try {
      const parsedSalary = parseFloat(salary) || 0;
      const parsedWorkDays = parseInt(workDays) || 22;
      const parsedWorkHours = parseInt(workHours) || 8;
      const currencyCode = selectedCurrency?.value || "USD";

      const totalHours = parsedWorkDays * parsedWorkHours;
      const hourlyRate = totalHours > 0 ? parsedSalary / totalHours : 0;

      await db
        .insert(userSettings)
        .values({
          id: 1,
          salary: parsedSalary,
          currency: currencyCode,
          workDaysPerMonth: parsedWorkDays,
          workHoursPerDay: parsedWorkHours,
          hourlyRate: hourlyRate,
          isOnboarded: true,
        })
        .onConflictDoUpdate({
          target: userSettings.id,
          set: {
            salary: parsedSalary,
            currency: currencyCode,
            workDaysPerMonth: parsedWorkDays,
            workHoursPerDay: parsedWorkHours,
            hourlyRate: hourlyRate,
            isOnboarded: true,
            updatedAt: new Date(),
          },
        });

      if (hourlyRate > 0) {
        await db
          .update(itemsTable)
          .set({
            timeCost: sql`ROUND(${itemsTable.price} / ${hourlyRate}, 1)`,
          });
      }

      await loadData();
      router.back();
    } catch (e) {
      handleError(e, "Error updating settings");
    }
  };

  if (!isReady || !settings) {
    return <View className="flex-1 bg-background" />;
  }

  const formattedRate = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: settings?.currency || "USD",
    maximumFractionDigits: 0,
    currencyDisplay: "narrowSymbol",
  }).format(settings?.hourlyRate || 0);

  return (
    <View
      style={{ flex: 1 }}
      className="flex-1 bg-background flex flex-col gap-y-12 px-3 pt-3"
    >
      <Pressable
        onPress={() => router.back()}
        className="flex flex-row items-center gap-x-3 justify-start"
      >
        <XIcon color={"#6366f1"} height={30} width={30} />

        <Text variant="h3" className="font-bold">
          Setting
        </Text>
      </Pressable>

      <View className="flex items-center gap-y-3">
        <Text variant="small" className="text-accent-info">
          Current Hourly Worth
        </Text>

        <Text variant="h1" className="text-5xl">
          {formattedRate}
          <Text variant="large">/hour</Text>
        </Text>

        <Text variant="muted" className="text-center">
          This is the price of your time. Every purchase will be measured
          against this rate.
        </Text>
      </View>

      <View className="flex flex-col gap-y-4">
        <Text variant="h4" className="font-bold">
          Temporal Value
        </Text>

        <Card className="p-4 gap-y-4 bg-default rounded-xl border-0 flex">
          <TextField className="flex gap-y-2">
            <Label className="text-foreground">Monthly Take Home Pay</Label>
            <Input
              value={formatPrice(salary)}
              onChangeText={handleSalaryChange}
              className="bg-background border-0"
              keyboardType="numeric"
            />
          </TextField>

          <View className="flex flex-row gap-x-4">
            <TextField className="flex-1 flex gap-y-2">
              <Label className="text-foreground">Work Days/Month</Label>
              <Input
                value={workDays}
                onChangeText={handleWorkDaysChange}
                className="bg-background border-0"
                keyboardType="numeric"
              />
            </TextField>

            <TextField className="flex-1 flex gap-y-2">
              <Label className="text-foreground">Hours/Day</Label>
              <Input
                value={workHours}
                onChangeText={handleWorkHoursChange}
                className="bg-background border-0"
                keyboardType="numeric"
              />
            </TextField>
          </View>

          <View className="flex flex-col gap-y-2">
            <Label className="text-foreground">Currency</Label>
            <Select
              value={selectedCurrency}
              onValueChange={(val) => setSelectedCurrency(val as any)}
              presentation="bottom-sheet"
            >
              <Select.Trigger className="bg-background border-0 py-3 px-4 rounded-xl">
                <Select.Value
                  placeholder="Select currency"
                  className="text-foreground"
                />
                <Select.TriggerIndicator className="text-foreground" />
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
          </View>
        </Card>
      </View>

      <View>
        <Button
          className="w-full rounded-xl bg-primary"
          onPress={handleUpdate}
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
          <Text variant="p">Update Settings</Text>
        </Button>
      </View>
    </View>
  );
}
