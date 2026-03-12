import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  TextInput,
  Dimensions
} from 'react-native';
import { createTypedSupabaseClient, useCartStore } from '@plantsswaad/shared';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createTypedSupabaseClient(supabaseUrl, supabaseAnonKey);

const { width } = Dimensions.get('window');

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state: any) => state.addItem);

  useEffect(() => {
    async function fetchData() {
      const [catsRes, itemsRes] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('menu_items').select('*').eq('is_available', true).eq('is_featured', true).limit(6)
      ]);
      if (catsRes.data) setCategories(catsRes.data);
      if (itemsRes.data) setFeaturedItems(itemsRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>PlanetsSwaad</Text>
            <Text style={styles.subtitle}>Swad Jo Dil Ko Chhoo Jaye</Text>
          </View>
          <View style={styles.profileBadge}>
            <Text style={styles.profileText}>👤</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            placeholder="Search for pure veg dishes..." 
            placeholderTextColor="#8ba196"
            style={styles.searchInput}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#468f71" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Categories */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore Categories</Text>
              <Text style={styles.seeAllText}>See all</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {categories.map((cat, index) => (
                <TouchableOpacity key={cat.id || index} style={styles.categoryCard}>
                  <View style={styles.categoryIconBox}>
                    {cat.image_url ? (
                      <Image source={{ uri: cat.image_url }} style={styles.categoryImage} />
                    ) : (
                      <Text style={styles.categoryEmoji}>🍲</Text>
                    )}
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Featured Items */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Right Now</Text>
            </View>
            
            <View style={styles.gridContainer}>
              {featuredItems.length > 0 ? featuredItems.map((item, index) => (
                <View key={item.id || index} style={styles.foodCard}>
                  <View style={styles.foodImageContainer}>
                    {item.image_url ? (
                      <Image source={{ uri: item.image_url }} style={styles.foodImage} />
                    ) : (
                      <View style={styles.foodImagePlaceholder}><Text style={{fontSize: 40}}>🥗</Text></View>
                    )}
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>⭐ Bestseller</Text>
                    </View>
                  </View>
                  
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.foodDesc} numberOfLines={2}>
                      {item.description || 'Prepared fresh with authentic spices.'}
                    </Text>
                    
                    <View style={styles.foodFooter}>
                      <Text style={styles.foodPrice}>₹{item.price}</Text>
                      <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => addItem(item)}
                      >
                        <Text style={styles.addButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )) : (
                <View style={{ padding: 20, alignItems: 'center', width: '100%' }}>
                   <Text style={{ color: '#8ba196' }}>No items found</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Menu Screen
const MenuScreen = () => {
    const [categories, setCategories] = useState<any[]>([{ id: 'ALL', name: 'All' }]);
    const [activeCategory, setActiveCategory] = useState<string>('ALL');
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state: any) => state.addItem);
  
    useEffect(() => {
      async function fetchMenuData() {
        const [catsRes, itemsRes] = await Promise.all([
          supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('menu_items').select('*').eq('is_available', true)
        ]);
        
        if (catsRes.data) {
          setCategories([{ id: 'ALL', name: 'All' }, ...catsRes.data]);
        }
        if (itemsRes.data) {
          setMenuItems(itemsRes.data);
        }
        setLoading(false);
      }
      fetchMenuData();
    }, []);
  
    const filteredItems = activeCategory === 'ALL' 
      ? menuItems 
      : menuItems.filter(item => item.category_id === activeCategory);
  
    return (
      <SafeAreaView style={styles.container}>
        {/* Sticky Header */}
        <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Explore Menu</Text>
        </View>
  
        {loading ? (
          <ActivityIndicator size="large" color="#468f71" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Filter Bar */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <TouchableOpacity 
                            key={cat.id} 
                            style={[styles.filterChip, isActive && styles.filterChipActive]}
                            onPress={() => setActiveCategory(cat.id)}
                        >
                            <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
                </ScrollView>
            </View>
            
            {/* Menu List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuListScroll}>
              {filteredItems.map((item, index) => (
                <View key={item.id || index} style={styles.menuItemCard}>
                    <View style={styles.menuItemImageContainer}>
                      {item.image_url ? (
                        <Image source={{ uri: item.image_url }} style={styles.menuItemImage} />
                      ) : (
                        <View style={styles.menuItemImagePlaceholder}><Text style={{fontSize: 24}}>🥘</Text></View>
                      )}
                    </View>
                    
                    <View style={styles.menuItemInfo}>
                        <View>
                            <Text style={styles.menuItemName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.menuItemDesc} numberOfLines={2}>
                                {item.description || 'Deliciously prepared authentic dish.'}
                            </Text>
                        </View>
                        <View style={styles.menuItemFooter}>
                            <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                            <TouchableOpacity 
                                style={styles.menuItemAddBtn}
                                onPress={() => addItem(item)}
                            >
                                <Text style={styles.menuItemAddBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
              ))}
              {filteredItems.length === 0 && (
                 <View style={{ padding: 40, alignItems: 'center' }}>
                     <Text style={{ color: '#8ba196', fontSize: 16 }}>No items found in this section.</Text>
                 </View>
              )}
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    );
  };

const CartScreen = () => {
  const items = useCartStore((state: any) => state.items);
  const addItem = useCartStore((state: any) => state.addItem);
  const decrementItem = useCartStore((state: any) => state.decrementItem);
  const removeItem = useCartStore((state: any) => state.removeItem);
  const getTotal = useCartStore((state: any) => state.getTotal);
  
  const total = getTotal();
  const deliveryFee = items.length > 0 ? 49 : 0;
  const grandTotal = total + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuHeader}>
        <Text style={styles.menuTitle}>Your Cart</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartIcon}>🛒</Text>
          <Text style={styles.emptyCartText}>Your cart is feeling light</Text>
          <Text style={styles.emptyCartSubtext}>Add some Earthy Bowls to get started!</Text>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cartScroll}>
            <View style={styles.cartItemList}>
              {items.map((item: any, index: number) => (
                <View key={item.id || index} style={styles.cartItemRow}>
                  <View style={styles.cartItemInfoGroup}>
                    {item.image_url ? (
                      <Image source={{ uri: item.image_url }} style={styles.cartItemImage} />
                    ) : (
                      <View style={styles.cartItemImagePlaceholder}><Text>🥘</Text></View>
                    )}
                    <View style={styles.cartItemDetails}>
                      <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>₹{item.price}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.cartItemActions}>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                    <View style={styles.qtyPill}>
                      <TouchableOpacity onPress={() => decrementItem(item.id)} style={styles.qtyBtn}>
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyNumber}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => addItem(item)} style={styles.qtyBtn}>
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.billDetailsCard}>
              <Text style={styles.billTitle}>Bill Details</Text>
              
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Item Total</Text>
                <Text style={styles.billValue}>₹{total}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Text style={styles.billValue}>₹{deliveryFee}</Text>
              </View>
              
              <View style={styles.billDivider} />
              
              <View style={styles.billRow}>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.grandTotalValue}>₹{grandTotal}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.checkoutBar}>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Checkout - ₹{grandTotal}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const OrdersScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    // Note: For a real app, this would filter by user_id
    const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
    if (data) {
        // Filter out completely finished orders if we only want "Active"
        // setOrders(data.filter(o => o.status !== 'Delivered'));
        setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const ordersSubscription = supabase
        .channel('public:mobile_orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
        .subscribe();

    return () => {
        supabase.removeChannel(ordersSubscription);
    };
  }, []);

  const stages = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuHeader}>
        <Text style={styles.menuTitle}>Live Orders</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#468f71" style={{ marginTop: 40 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartIcon}>📦</Text>
          <Text style={styles.emptyCartText}>No active orders right now</Text>
          <Text style={styles.emptyCartSubtext}>Your recent deliveries will appear here.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ordersScroll}>
          {orders.map((order, index) => {
            const currentStageIndex = stages.indexOf(order.status);
            const isCompleted = order.status === 'Delivered';
            
            return (
              <View key={order.id || index} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>#ORD-{order.id ? order.id.substring(0, 4).toUpperCase() : 'XXXX'}</Text>
                    <Text style={styles.orderTime}>
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.orderPrice}>₹{order.total_amount}</Text>
                    <Text style={styles.orderItemsCount}>
                      {Array.isArray(order.items) ? order.items.length : 0} Items
                    </Text>
                  </View>
                </View>

                {/* Status Timeline */}
                <View style={styles.timelineContainer}>
                  {[0, 2, 3, 4].map((stageIndex, i) => { // Displaying key stages: Placed, Preparing, Out, Delivered
                    const isPassed = currentStageIndex >= stageIndex;
                    const isActive = currentStageIndex === stageIndex;
                    return (
                      <View key={stageIndex} style={styles.timelineStep}>
                        <View style={[
                          styles.timelineDot, 
                          isPassed && styles.timelineDotPassed,
                          isActive && styles.timelineDotActive
                        ]}>
                          {isPassed && <Text style={{color: '#fff', fontSize: 8}}>✓</Text>}
                        </View>
                        <Text style={[
                          styles.timelineText,
                          isActive && styles.timelineTextActive
                        ]}>{stages[stageIndex]}</Text>
                        {i < 3 && (
                          <View style={[
                            styles.timelineLine,
                            currentStageIndex > stageIndex && styles.timelineLinePassed
                          ]} />
                        )}
                      </View>
                    );
                  })}
                </View>

                <TouchableOpacity style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsText}>{isCompleted ? 'Reorder' : 'Track Order'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const ProfileScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.menuHeader}>
      <Text style={styles.menuTitle}>Profile</Text>
    </View>

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.profileScroll}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileHeaderRow}>
          <View style={styles.profileAvatarPlaceholder}>
            <Text style={styles.profileAvatarText}>GU</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Guest User</Text>
            <Text style={styles.profilePhone}>+91 99999 99999</Text>
            <TouchableOpacity style={styles.editProfileBtn}>
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Earthy Points Banner */}
      <View style={styles.pointsBanner}>
        <View style={styles.pointsLeft}>
          <Text style={styles.pointsIcon}>🍃</Text>
          <View>
            <Text style={styles.pointsTitle}>Earthy Points</Text>
            <Text style={styles.pointsSubtitle}>Your organic rewards balance</Text>
          </View>
        </View>
        <Text style={styles.pointsValue}>450</Text>
      </View>

      {/* Settings Groups */}
      <View style={styles.settingsGroup}>
        <Text style={styles.settingsGroupTitle}>Account Settings</Text>
        {[
          { icon: '📍', label: 'Saved Addresses' },
          { icon: '💳', label: 'Payment Methods' },
          { icon: '🕰️', label: 'Order History' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <Text style={styles.settingsIcon}>{item.icon}</Text>
              <Text style={styles.settingsLabel}>{item.label}</Text>
            </View>
            <Text style={styles.settingsChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.settingsGroup}>
        <Text style={styles.settingsGroupTitle}>Support & About</Text>
        {[
          { icon: '🎧', label: 'Help Center' },
          { icon: '💬', label: 'App Feedback' },
          { icon: '📜', label: 'Terms & Privacy Info' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.settingsRow}>
            <View style={styles.settingsRowLeft}>
              <Text style={styles.settingsIcon}>{item.icon}</Text>
              <Text style={styles.settingsLabel}>{item.label}</Text>
            </View>
            <Text style={styles.settingsChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <Text style={styles.appVersion}>PlanetsSwaad v1.0.0</Text>
    </ScrollView>
  </SafeAreaView>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#468f71', 
          tabBarInactiveTintColor: '#bedece', 
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: { fontWeight: '600', fontSize: 12 },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <Text>🏠</Text> }} />
        <Tab.Screen name="Menu" component={MenuScreen} options={{ tabBarIcon: () => <Text>📖</Text> }} />
        <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: () => <Text>🛒</Text> }} />
        <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarIcon: () => <Text>🛵</Text> }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Text>👤</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f3', 
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#24493c', 
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#468f71', 
    fontWeight: '600',
    marginTop: 2,
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8f0eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#24493c',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#24493c',
  },
  seeAllText: {
    fontSize: 14,
    color: '#468f71',
    fontWeight: '600',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  categoryCard: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  categoryIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#556c60',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  foodCard: {
    width: width / 2 - 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 4,
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
    overflow: 'hidden',
  },
  foodImageContainer: {
    height: 140,
    width: '100%',
    backgroundColor: '#f4f4f4',
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8ecdf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#468f71',
  },
  foodInfo: {
    padding: 14,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#24493c',
    marginBottom: 4,
  },
  foodDesc: {
    fontSize: 11,
    color: '#8ba196',
    lineHeight: 16,
    marginBottom: 12,
  },
  foodFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#24493c',
  },
  addButton: {
    backgroundColor: '#468f71',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    height: 65,
    paddingBottom: 10,
    paddingTop: 8,
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#faf7f3',
    borderBottomWidth: 1,
    borderBottomColor: '#eeede8',
    elevation: 2,
    zIndex: 10,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#24493c',
  },
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: '#faf7f3',
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8ecdf',
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#468f71',
    borderColor: '#468f71',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#556c60',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  menuListScroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  menuItemCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  menuItemImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f4f4f4',
  },
  menuItemImage: {
    width: '100%',
    height: '100%',
  },
  menuItemImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8ecdf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#24493c',
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: 12,
    color: '#8ba196',
    lineHeight: 16,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#24493c',
  },
  menuItemAddBtn: {
    backgroundColor: '#468f71',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemAddBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyCartIcon: {
    fontSize: 70,
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyCartText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#24493c',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: '#8ba196',
    textAlign: 'center',
    lineHeight: 20,
  },
  cartScroll: {
    padding: 16,
    paddingBottom: 100,
  },
  cartItemList: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  cartItemInfoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
  },
  cartItemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#e8ecdf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemDetails: {
    marginLeft: 12,
    flex: 1,
  },
  cartItemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#24493c',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#468f71',
  },
  cartItemActions: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
  },
  deleteButton: {
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  deleteButtonText: {
    color: '#c2c2c2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  qtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f2',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e9e5',
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  qtyBtnText: {
    fontSize: 16,
    color: '#468f71',
    fontWeight: 'bold',
  },
  qtyNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#24493c',
    marginHorizontal: 8,
  },
  billDetailsCard: {
    backgroundColor: '#f7edde', // Warm earthen tone
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8a6237',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#55371c',
    marginBottom: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 14,
    color: '#7f6146',
    fontWeight: '500',
  },
  billValue: {
    fontSize: 14,
    color: '#55371c',
    fontWeight: '700',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#e6dbcc',
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    color: '#55371c',
    fontWeight: '800',
  },
  grandTotalValue: {
    fontSize: 18,
    color: '#468f71',
    fontWeight: '800',
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 10,
  },
  checkoutButton: {
    backgroundColor: '#468f71',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ordersScroll: {
    padding: 16,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
    paddingBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '800',
    color: '#24493c',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 13,
    color: '#8ba196',
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#468f71',
    marginBottom: 4,
  },
  orderItemsCount: {
    fontSize: 13,
    color: '#556c60',
    fontWeight: '600',
  },
  viewDetailsButton: {
    backgroundColor: '#f0f4f2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#468f71',
    fontWeight: 'bold',
    fontSize: 15,
  },
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    position: 'relative',
    paddingHorizontal: 8,
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e8ecdf',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    zIndex: 2,
  },
  timelineDotPassed: {
    backgroundColor: '#bedece',
  },
  timelineDotActive: {
    backgroundColor: '#468f71',
    transform: [{ scale: 1.2 }],
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineText: {
    fontSize: 10,
    color: '#8ba196',
    textAlign: 'center',
    fontWeight: '500',
  },
  timelineTextActive: {
    color: '#24493c',
    fontWeight: '800',
  },
  timelineLine: {
    position: 'absolute',
    top: 9,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: '#e8ecdf',
    zIndex: 1,
  },
  timelineLinePassed: {
    backgroundColor: '#bedece',
  },
  profileScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e8f0eb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#bedece',
  },
  profileAvatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#468f71',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#24493c',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: '#8ba196',
    fontWeight: '500',
    marginBottom: 10,
  },
  editProfileBtn: {
    backgroundColor: '#bedece',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  editProfileBtnText: {
    color: '#24493c',
    fontWeight: '700',
    fontSize: 12,
  },
  pointsBanner: {
    backgroundColor: '#f6eedf',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#8a6237',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  pointsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#55371c',
  },
  pointsSubtitle: {
    fontSize: 12,
    color: '#7f6146',
    marginTop: 2,
  },
  pointsValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#468f71',
  },
  settingsGroup: {
    marginBottom: 24,
  },
  settingsGroupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8ba196',
    marginBottom: 12,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#468f71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
    marginRight: 14,
    width: 28,
    textAlign: 'center',
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#24493c',
  },
  settingsChevron: {
    fontSize: 22,
    color: '#bedece',
    fontWeight: '300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0f0',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 24,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    color: '#d34545',
    fontSize: 16,
    fontWeight: '700',
  },
  appVersion: {
    textAlign: 'center',
    color: '#c2dacd',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 20,
  }
});
