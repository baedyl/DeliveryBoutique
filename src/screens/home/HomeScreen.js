import React, {
  memo,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react'
import {
  Image,
  Keyboard,
  Platform,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import { TNTouchableIcon } from '../../Core/truly-native'
import { useCurrentUser } from '../../Core/onboarding'
import { useAuth } from '../../Core/onboarding/hooks/useAuth'

import {
  categoryData,
  SIZES,
  icons,
  images,
  COLORS,
  FONTS,
} from '../../constants'
import database from '@react-native-firebase/database'

export const HomeScreen = memo(props => {
  const { navigation } = props
  const currentUser = useCurrentUser()
  const authManager = useAuth()

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  // Dummy Datas
  const initialCurrentLocation = {
    streetName: 'The-AfricanBasket',
    gps: {
      latitude: 1.5496614931250685,
      longitude: 110.36381866919922,
    },
  }
  const homeCategory = {"icon": 22, "id": 0, "name": "Accueil"}

  // price rating
  const affordable = 1
  const fairPrice = 2
  const expensive = 3

  // Data from API
  // const [restaurantData, setRestaurantData] = React.useState(null)
  const restaurantsReference = database().ref('/Restaurants')
  const [categories, setCategories] = React.useState(categoryData)
  const [selectedCategory, setSelectedCategory] = React.useState(null)
  const [restaurantData, setRestaurants] = React.useState(restaurantData)
  const [restaurantDataCopy, setRestaurantsCopy] = React.useState(null)
  const [currentLocation, setCurrentLocation] = React.useState(
    initialCurrentLocation,
  )

  const [isLoading, setIsLoading] = useState(true)

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]

    navigation.setOptions({
      headerTitle: localized('Home'),
      headerRight: () => (
        <View>
          <TNTouchableIcon
            imageStyle={{ tintColor: colorSet.primaryForeground }}
            iconSource={theme.icons.logout}
            onPress={onLogout}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
        borderBottomColor: colorSet.hairline,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [])

  useEffect(() => {
    console.log('Current user : ', currentUser)
    // if (!currentUser?.id) {
    //   return
    // }
    let mounted = true
    let array = []
    console.log('restaurants ref: ', restaurantsReference)
    console.log(mounted)
    if (mounted) {
      console.log('Mounted is true :)')
      restaurantsReference.on(
        'value',
        snapshot => {
          console.log('Fetching restaurant data')
          // console.log('Restaurants data: ', snapshot.val())
          snapshot.forEach(item => {
            var snapshotItem = item.val()
            // snapshotItem.categories = JSON.parse(snapshotItem.categories);
            if (snapshotItem.rating >= 4.8) {
              array.push(snapshotItem)
            }
            // console.log(snapshotItem.categories)
          })
          setRestaurants(array)
          setRestaurantsCopy(array)
          array = []
        },
        err => {
          console.log(err)
        },
      )
    }
    // setCategorySelected(false)
    setSelectedCategory(homeCategory)

    return () => (mounted = false)
  }, [currentUser?.id])

  const onLogout = useCallback(() => {
    authManager?.logout(currentUser)
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoadScreen',
        },
      ],
    })
  }, [currentUser])

  function onSelectCategory(category) {
    console.log('--category-- ', category);
    console.log('--selected category-- ', selectedCategory);
    //filter restaurant
    if (category.id === 0) {
      setRestaurants(restaurantDataCopy)
      setSelectedCategory(category)
    } else if (category === selectedCategory) {
      // unselect category
      setSelectedCategory(homeCategory)
      setRestaurants(restaurantDataCopy)
    } else {
      // Select category
      console.log('data size --> ', restaurantData.length);
      if (restaurantData) {
        let restaurantList = restaurantDataCopy.filter(a =>
          a.categories.includes(category.id),
        )
        setRestaurants(restaurantList)
        setSelectedCategory(category)
      }
    }
    // In case there are no matching result
    // if (restaurantData.length === 0) {
    //   setRestaurants([])
    // }
  }

  function getCategoryNameById(id) {
    let category = categories.filter(a => a.id == id)

    if (category.length > 0) return category[0].name

    return ''
  }

  function renderHeader() {
    return (
      <View style={{ flexDirection: 'row', height: 50 }}>
        <TouchableOpacity
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.nearby}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>

        <View style={styles.logo}>
          <Image
            style={styles.logoImage}
            source={
              props.delayedMode ? theme.icons.delayedLogo : theme.icons.logo
            }
          />
        </View>

        <TouchableOpacity
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.basket}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  function renderMainCategories() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            padding: SIZES.padding,
            paddingBottom: SIZES.padding,
            backgroundColor: COLORS.transparent,
            borderBottomWidth: selectedCategory?.id == item.id ? 2 : 0,
            borderBottomColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SIZES.padding2,
            marginLeft: SIZES.padding2,
            ...styles.shadow,
          }}
          onPress={() => onSelectCategory(item)}>
          <Text
            style={{
              marginTop: SIZES.padding,
              color: COLORS.white,
              fontWeight: selectedCategory?.id == item.id ? 'bold' : 'normal',
              ...FONTS.body4,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={{ ...styles.categoriesContainer }}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: SIZES.padding * 2 }}
        />
        {/* <Text style={{ ...FONTS.h1 }}>Categories</Text> */}
      </View>
    )
  }

  function renderRestaurantList() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        style={[styles.restaurantItem]}
        onPress={() =>
          navigation.navigate('Restaurant', {
            item,
            currentLocation,
          })
        }
        disabled={item.closed}>
        {/* Image */}
        <View
          style={{
            marginBottom: SIZES.padding,
          }}>
          <ImageBackground
            source={item.photo ? images[item.photo] : images[fries_restaurant]}
            resizeMode="cover"
            style={{
              width: '100%',
              height: 200,
              borderRadius: SIZES.radius,
              opacity: item.closed ? 0.3 : 1,
            }}>
            <Text style={{ ...FONTS.h1 }}>
              {item.closed ? 'Coming Soon...' : ''}
            </Text>
            {/* Restaurant Info */}
            <View
              style={{
                marginTop: SIZES.padding,
                flexDirection: 'row',
                bottom: 0,
              }}>
              {/* Categories */}
              {/* <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 10,
                }}>
                {item.categories.map(categoryId => {
                  return (
                    <View style={{ flexDirection: 'row' }} key={categoryId}>
                      <Text style={{ ...FONTS.body3 }}>
                        {getCategoryNameById(categoryId)}
                      </Text>
                      <Text style={{ ...FONTS.h3, color: COLORS.darkgray }}>
                        {' '}
                        .{' '}
                      </Text>
                    </View>
                  )
                })} */}

              {/* Price */}
              {/* {[1, 2, 3].map(priceRating => (
                  <Text
                    key={priceRating}
                    style={{
                      ...FONTS.body3,
                      color:
                        priceRating <= item.priceRating
                          ? COLORS.black
                          : COLORS.darkgray,
                    }}>
                    $
                  </Text>
                ))}
              </View> */}
            </View>
          </ImageBackground>
          {/* Rating */}
          <View
            style={{
              marginTop: SIZES.padding,
              flexDirection: 'row',
              bottom: 0,
            }}>
            <Image
              source={icons.star}
              style={{
                height: 20,
                width: 20,
                tintColor: COLORS.primary,
                marginRight: 10,
              }}
            />
            <Text style={{ ...FONTS.body3 }}>{item.rating}</Text>
          </View>

          {/* <View
            style={{
              position: 'absolute',
              bottom: 0,
              height: 50,
              width: SIZES.width * 0.3,
              backgroundColor: COLORS.white,
              borderTopRightRadius: SIZES.radius,
              borderBottomLeftRadius: SIZES.radius,
              alignItems: 'center',
              justifyContent: 'center',
              ...styles.shadow,
            }}>
            <Text style={{ ...FONTS.h4 }}>{item.duration}</Text>
          </View> */}
        </View>
      </TouchableOpacity>
    )

    return (
      <FlatList
        data={restaurantData}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      />
    )
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={images.flowers}
        resizeMode="cover"
        style={{
          width: '100%',
          height: 200,
          borderRadius: SIZES.radius,
          opacity: 0.7,
          marginBottom: 10,
        }}>
        {renderHeader()}
        {renderMainCategories()}
      </ImageBackground>
      <Text style={{ ...FONTS.h3 }}>NOUVEAUTÉS DU JOUR</Text>
      <Text style={{ ...FONTS.body, marginBottom: 20, marginTop: 2 }}>
        Les ventes qui ouvrent aujoud'hui.
      </Text>
      {renderRestaurantList()}
      {/* <FastImage
        style={styles.image}
        source={{ uri: currentUser?.profilePictureURL }}
      />
      <Text style={styles.text}>
        {localized('Logged in as')} {currentUser?.email}
      </Text>
      <Text style={styles.text}>
        {localized('Current user id')} {currentUser?.id}
      </Text> */}
    </View>
  )
})
