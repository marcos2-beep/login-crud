import { useAuth } from '@/components/context/auth-context';
import { HapticTab } from '@/components/haptic-tab';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const { user } = useAuth();
  const isAuthenticated = !!user?.token;

  // Si no hay usuario autenticado, redirigir siempre a login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={'#6B46C1'} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Libros',
          tabBarIcon: ({ color }) => <Feather name="book-open" size={24} color={'#6B46C1'} />,
        }}
      />
      <Tabs.Screen
        name="add-task"
        options={{
          title: 'Agregar',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={24} color={'#6B46C1'} />,
        }}
      />
      
    </Tabs>
  );
}