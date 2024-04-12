import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Sample data
const farmData = {
  name: 'My Farm',
  crops: ['Corn', 'Wheat', 'Soybean'],
  location: 'Farmington, USA',
};

// PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  tableHeader: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});

// PDF component
const FarmPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Farm Details:</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Attribute</Text>
            <Text style={styles.tableHeader}>Value</Text>
          </View>
          {/* Table Rows */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Farm Name</Text>
            <Text style={styles.tableCell}>{farmData.name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Location</Text>
            <Text style={styles.tableCell}>{farmData.location}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Crops</Text>
            <Text style={styles.tableCell}>{farmData.crops.join(', ')}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// Main component
const PDF = () => (
  <div>
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <FarmPDF />
    </PDFViewer>
  </div>
);

export default PDF;
