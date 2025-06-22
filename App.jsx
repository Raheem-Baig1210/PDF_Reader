import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialIcons';

const App = () => {
  const [pdfPath, setPdfPath] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to read PDF files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission required', 'Storage permission is required to read PDF files');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      
      if (res) {
        setPdfPath(res[0].uri);
        setPage(1);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Failed to pick PDF file');
        console.error(err);
      }
    }
  };

  const onLoadComplete = (numberOfPages, filePath) => {
    setTotalPages(numberOfPages);
    setIsLoading(false);
  };

  const onPageChanged = (page, numberOfPages) => {
    setPage(page);
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      pdfRef.current?.setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
      pdfRef.current?.setPage(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      {!pdfPath ? (
        <View style={styles.placeholderContainer}>
          <TouchableOpacity style={styles.selectButton} onPress={selectFile}>
            <Icon name="insert-drive-file" size={50} color="#007AFF" />
            <Text style={styles.selectButtonText}>Select PDF File</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.pdfContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Page {page} of {totalPages}
            </Text>
          </View>
          
          <View style={styles.pdfViewer}>
            <Pdf
              ref={pdfRef}
              source={{uri: pdfPath, cache: true}}
              style={styles.pdf}
              onLoadComplete={onLoadComplete}
              onPageChanged={onPageChanged}
              onError={error => {
                console.log(error);
                Alert.alert('Error', 'Failed to load PDF');
                setIsLoading(false);
              }}
              onLoadStart={() => setIsLoading(true)}
              onLoadProgress={() => setIsLoading(false)}
              enablePaging={false}
              horizontal={false}
              enableRTL={false}
              enableAnnotationRendering={true}
              enableAntialiasing={true}
              fitPolicy={0}
              minScale={0.5}
              maxScale={3.0}
              spacing={10}
              password=""
              page={page}
              scale={1.0}
            />
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.navButton, page <= 1 && styles.disabledButton]}
              onPress={goToPreviousPage}
              disabled={page <= 1}>
              <Icon name="chevron-left" size={24} color={page <= 1 ? '#999' : '#007AFF'} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.selectButton} onPress={selectFile}>
              <Text style={styles.selectButtonText}>Select Another PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.navButton, page >= totalPages && styles.disabledButton]}
              onPress={goToNextPage}
              disabled={page >= totalPages}>
              <Icon name="chevron-right" size={24} color={page >= totalPages ? '#999' : '#007AFF'} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  selectButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectButtonText: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  pdfContainer: {
    flex: 1,
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  pdfViewer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    padding: 10,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default App;
