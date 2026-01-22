import { View } from "react-native";

import { Text } from "@/components/ui/text";

export default function Index() {
  return (
    <View
      style={{
        flex: 1
      }}
      className="flex flex-col items-center flex-1 p-3 justify-between"
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
