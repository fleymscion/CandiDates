import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventCard({ item, onDelete, onUnhide, onToggleHighlight }) {
  const isHighlighted = item.classification === 'highlighted';

  return (
    <View style={[styles.card, isHighlighted && styles.highlightedCard]}>
      
      {/* Top Action Row */}
      <View style={styles.actionRow}>
        {onToggleHighlight ? (
          <TouchableOpacity 
            onPress={() => onToggleHighlight(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons 
              name={isHighlighted ? "heart" : "heart-outline"} 
              size={20} 
              color="#002060" 
            />
          </TouchableOpacity>
        ) : <View />}

        {onUnhide ? (
          <TouchableOpacity onPress={() => onUnhide(item.id)}>
            <Text style={styles.actionText}>▲</Text>
          </TouchableOpacity>
        ) : onDelete ? (
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Text style={styles.actionText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Image / Placeholder */}
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
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
    position: 'relative',
  },
  highlightedCard: {
    borderColor: '#002060',
    borderWidth: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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