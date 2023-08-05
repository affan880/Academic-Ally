import LottieView from 'lottie-react-native';
import { Alert, Box, Center, CloseIcon, Divider, HStack, Icon, IconButton, Modal, Text, Toast, VStack, Wrap } from 'native-base'
import { PDFDocument } from 'pdf-lib'
import React, { useEffect, useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'

import createStyles from './styles';

type Props = {
  setVisibleSpliterModal: any,
  visibleSpliterModal: any,
  createChat: any,
  currentProgress: any,
  startedProcessing: any,
  totalPdfPages: number,
  maxPages: number
}

const PdfPageSplitter = ({  setVisibleSpliterModal, visibleSpliterModal, createChat , currentProgress, startedProcessing, totalPdfPages, maxPages}: Props) => {
  const totalPageNumbersAllowed = maxPages;
  const [totalPages, setTotalPages] = useState<any>([])
  const [fromPage, setFromPage] = useState('')
  const [toPage, setToPage] = useState('')

  const theme = useSelector((state: any) => { return state.theme; });
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);

  const handleAddRange = () => {
    const from = fromPage === '0' ? parseInt('1') : parseInt(fromPage);
    const to = parseInt(toPage);
  
    if (isNaN(from) || isNaN(to)) {
      // Alert.alert('Invalid Range', 'Please enter valid page numbers.');
      Toast.show({
        title: "Invalid Range, Please enter valid page numbers.",
        placement: 'bottom',
        backgroundColor: '#FF0101',
        duration: 1000,
      })
    }
  
    if (from > to) {
      Toast.show({
        title: "Invalid Range', The 'from' value cannot be greater than the 'to' value.",
        placement: 'bottom',
        backgroundColor: '#FF0101',
        duration: 1000,
      })
    }
  
    const newRange = Array.from({ length: to - from + 1 }, (_, index) => from + index);
  
    const filteredRange = newRange.filter((page) => !totalPages.includes(page));
  
    const combinedPages = [...totalPages, ...filteredRange];
  
    let limitedTotalPages = combinedPages.slice(0, totalPageNumbersAllowed);
    if (limitedTotalPages.length < combinedPages.length) {
      Toast.show({
        title: `Length Limit Exceeded', The total number of pages cannot exceed ${totalPageNumbersAllowed}.`,
        placement: 'bottom',
        backgroundColor: '#FF0101',
        duration: 3000,
      })
    }
  
    limitedTotalPages = limitedTotalPages.sort((a, b) => a - b);
  
    setTotalPages(limitedTotalPages);
    setFromPage('');
    setToPage('');
  };

  function getNextPageNumbers(totalPageNumbers: any, starting: any) {
    const nextPageNumbers = [];
  
    for (let i = starting; i <= totalPageNumbers && nextPageNumbers.length < totalPageNumbersAllowed; i++) {
      nextPageNumbers.push(i);
    }
  
    return nextPageNumbers[nextPageNumbers.length -1];
  }

  return (
    <Modal isOpen={visibleSpliterModal} onClose={()=>{
      setVisibleSpliterModal();
    }}  size={'xl'}>
        <Alert
            maxW="400"
            status="info"
            colorScheme="info"
            position='absolute'
            top={20}
            collapsable
          >
            <VStack space={2} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                  The PDF contains more than {maxPages} pages.
                  </Text>
                </HStack>
                <IconButton
                  variant="unstyled"
                  _focus={{
                    borderWidth: 0
                  }}
                  icon={<CloseIcon size="3"  />}
                  _icon={{
                    color: "coolGray.600"
                  }}
                />
              </HStack>
              <Box pl="6" _text={{
                color: "coolGray.600"
              }}>
                <Text color={'coolGray.600'} >
                    Please select a range of pages (maximum {maxPages} pages) you want to chat with.
                </Text>
              </Box>
            </VStack>
          </Alert>
    <Modal.Content size={'sm'}>
      <Modal.CloseButton />
        {
          !startedProcessing && <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
          <Box marginTop={10} marginX={3} justifyContent="space-around"  >
            <Box>
              <Text fontSize={'lg'} fontWeight={'bold'} mb={2}>
                Choose Pages to Chat
              </Text>
              <Text fontSize={'md'} fontWeight={'semibold'} color={theme.colors.terinaryText} my={2}>
                Total Pages : {totalPages?.length}
              </Text>
              <Box height={100} >
                {
                  totalPages?.length === 0 && <Box marginTop={10} width={'100%'} flexDirection='row' alignItems={'flex-start'} justifyContent={'space-around'} >
                    <TouchableOpacity
                    onPress={()=>{
                      const newRange = Array.from({ length: 15 - 1 + 1 }, (_, index) => 1 + index);
                      setTotalPages(newRange)
                      }}
                      style={{
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        // backgroundColor: theme.colors.mainTheme,
                        alignSelf: 'center',
                        borderRadius: 10,
                        flexDirection: 'row',
                        paddingHorizontal: 5,
                        marginBottom: 20,
                      }}
                    >
                      <Text color={theme.colors.mainTheme} fontSize={'md'} fontWeight={'bold'} textDecorationLine={'underline'}>
                        From 1 - 15
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{
                      const newRange = Array.from({ length: totalPageNumbersAllowed - 1 + 1 }, (_, index) => 1 + index);
                      setTotalPages(newRange)
                      }}
                      style={{
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        // backgroundColor: theme.colors.mainTheme,
                        alignSelf: 'center',
                        borderRadius: 10,
                        flexDirection: 'row',
                        paddingHorizontal: 5,
                        marginBottom: 20,
                      }}
                    >
                      <Text color={theme.colors.mainTheme} fontSize={'md'} fontWeight={'bold'} textDecorationLine={'underline'}>
                        From 1 - {totalPageNumbersAllowed}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={()=>{
                        const newRange = Array.from({ length: getNextPageNumbers(totalPdfPages,maxPages) - maxPages + 1 }, (_, index) => maxPages + index);
                        setTotalPages(newRange)
                      }}
                      style={{
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        // backgroundColor: theme.colors.mainTheme,
                        alignSelf: 'center',
                        borderRadius: 10,
                        flexDirection: 'row',
                        paddingHorizontal: 5,
                        marginBottom: 20,
                      }}
                    >
                      <Text color={theme.colors.mainTheme} fontSize={'md'} fontWeight={'bold'} textDecorationLine={'underline'} >
                        From 31 - {getNextPageNumbers(totalPdfPages, maxPages)}
                      </Text>
                    </TouchableOpacity>
                  </Box> 
                }
                <Wrap direction="row" space={2}>
                  {totalPages.map((item: any, index: any) => {
                    const handlePageClick = (clickedItem: any) => {
                      const updatedPages = totalPages.filter((item: any) => item !== clickedItem);
                      setTotalPages(updatedPages);
                    };
                    return (
                      <TouchableOpacity key={index} onPress={() => { handlePageClick(item) }}>
                        <Box
                          borderWidth={2}
                          borderColor={theme.colors.greenSuccess}
                          width={8}
                          height={8}
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={'green.100'}
                          borderRadius={10}
                        >
                          <Text color={theme.colors.mainTheme} fontWeight="700" fontSize="sm">
                            {item}
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    );
                  })}
                </Wrap>
              </Box>
            </Box>
            <Box alignSelf={'flex-end'}>
              <Box width={'100%'} justifyContent={'space-around'} flexDirection={'row'} alignItems={'center'} marginY={6}>
                <Box width={140} borderWidth={1} borderColor={theme.colors.terinaryText} backgroundColor={'blue.50'} borderRadius={15} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
                  <Text width={70} textAlign={'center'} color={theme.colors.terinaryText} borderRightWidth={1} borderColor={theme.colors.terinaryText}>From</Text>
                  <TextInput
                    style={{
                      width: 70
                    }}
                    placeholder='Ex 1, 2'
                    placeholderTextColor={theme.colors.terinaryText}
                    value={fromPage}
                    onChangeText={(text) => setFromPage(text.replace(/[^0-9]/g, ''))}
                    keyboardType='numeric'
                    maxLength={3}
                  />
                </Box>
                <Box width={140} borderWidth={1} borderColor={theme.colors.terinaryText} backgroundColor={'blue.50'} borderRadius={15} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
                  <Text width={70} textAlign={'center'} color={theme.colors.terinaryText} borderRightWidth={1} borderColor={theme.colors.terinaryText}>To</Text>
                  <TextInput
                    style={{
                      width: 70
                    }}
                    placeholder='Ex 1, 2'
                    placeholderTextColor={theme.colors.terinaryText}
                    value={toPage}
                    onChangeText={(text) => setToPage(text.replace(/[^0-9]/g, ''))}
                    keyboardType='numeric'
                    maxLength={3}
                  />
                </Box>
                <TouchableOpacity style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: theme.colors.mainTheme,
                  justifyContent: 'center',
                  alignItems: 'center'
                }} onPress={handleAddRange}>
                  <Icon as={Ionicons} name="ios-add-sharp" size="2xl" color={theme.colors.white} />
                </TouchableOpacity>
              </Box>
              <TouchableOpacity
                onPress={()=>createChat(totalPages)}
                style={{
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  width: 130,
                  height: 50,
                  backgroundColor: theme.colors.mainTheme,
                  alignSelf: 'center',
                  borderRadius: 10,
                  flexDirection: 'row',
                  paddingHorizontal: 5,
                  marginBottom: 5,
                }}
              >
                <Text color={theme.colors.white} fontSize={'md'} fontWeight={'bold'} >
                  Chat
                </Text>
                <Icon as={Ionicons} name="chatbubble-sharp" size="lg" color={theme.colors.white} />
              </TouchableOpacity>
            </Box>
          </Box>
          </ScrollView>
        </KeyboardAvoidingView>
        }
        {
          startedProcessing && <>
        {theme.theme !== 'dark' ? (
          <Box flex={1}>
          <LottieView
            source={require('../../assets/lottie/loading-doc-light.json')}
            autoPlay
            loop
          />
          </Box>
        ) : (
          <LottieView
          source={require('../../assets/lottie/loading-doc.json')}
          autoPlay
          loop
          />
          )}
          <Text alignSelf={'center'} fontSize={'md'} paddingBottom={10}>{currentProgress}</Text>
          </>
        }
    </Modal.Content>
  </Modal>
  )
}

export default PdfPageSplitter
