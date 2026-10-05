import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function EventCard({ item, onDelete, onUnhide }) {
  const isHighlighted = item.classification === 'highlighted';

  return (
    <View style={[styles.card, isHighlighted && styles.highlightedCard]}>
      {/* Show Upward Chevron if in Hidden screen, otherwise show '✕' hide button */}
      {onUnhide ? (
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onUnhide(item.id)}
        >
          <Text style={styles.actionText}>▲</Text>
        </TouchableOpacity>
      ) : onDelete ? (
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.actionText}>✕</Text>
        </TouchableOpacity>
      ) : null}

      {/* Image or Placeholder Gray Box */}
      {item.imageUrl ? (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.image} 
          resizeMode="cover" 
        />
      ) : (
        <View style={styles.placeholderImage} />
      )}

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {item.eventTitle || 'Calendar'}
      </Text>

      {/* Date */}
      <Text style={styles.detailText} numberOfLines={1}>
        <Text style={styles.boldText}>Date: </Text>
        {item.date}
      </Text>

      {/* Location */}
      {item.location ? (
        <Text style={styles.detailText} numberOfLines={1}>
          <Text style={styles.boldText}>Location: </Text>
          {item.location}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 0.5,
    maxWidth: '50%',
    margin: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  highlightedCard: {
    borderColor: '#002060',
    borderWidth: 2,
  },
  actionButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    zIndex: 10,
    padding: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#002060',
    fontWeight: 'bold',
  },
  placeholderImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#333333',
    marginTop: 2,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
