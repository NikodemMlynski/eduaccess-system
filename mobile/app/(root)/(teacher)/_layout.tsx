import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, Calendar, BookCheck, DoorOpen, User } from 'lucide-react-native';

const TabIcon = ({ icon: Icon, focused }: { icon: typeof Home, focused: boolean }) => {
  return (
    <View className={`flex items-center justify-center rounded-full ${focused ? 'bg-accent/30' : ''}`}>
      <View className={`w-14 h-14 rounded-full items-center justify-center ${focused ? 'bg-accent' : 'bg-background'}`}>
        <Icon color="white" size={24} />
      </View>
    </View>
  );
};

const Layout = () => {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
            boxShadow: "3px 3px 20px 0px #000",
          backgroundColor: '#0B2E3F',
          borderTopWidth: 0,
          height: 80,
          marginHorizontal: 15,
            paddingHorizontal: 10,
          marginBottom: 20,
          borderRadius: 50,
          paddingBottom: 8,
          position: 'absolute',
          paddingTop: 20,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon={Home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon={Calendar} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="attendances"
        options={{
          title: 'Attendances',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon={BookCheck} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="door_requests"
        options={{
          title: 'Door Requests',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon={DoorOpen} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon icon={User} focused={focused} />,
        }}
      />
    </Tabs>
  );
};

export default Layout;
