-- Add astrologer_id column to bookings table to support astrologer bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS astrologer_id uuid REFERENCES astrologers(id) ON DELETE SET NULL;

-- Update existing bookings to have astrologer_id as NULL (optional, for data consistency)
UPDATE bookings 
SET astrologer_id = NULL 
WHERE astrologer_id IS NULL;

-- Add a check constraint to ensure either service_id or astrologer_id is provided (but not both)
ALTER TABLE bookings 
ADD CONSTRAINT check_service_or_astrologer 
CHECK (
    (service_id IS NOT NULL AND astrologer_id IS NULL) OR 
    (service_id IS NULL AND astrologer_id IS NOT NULL)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_astrologer_id ON bookings(astrologer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_astrologer ON bookings(service_id, astrologer_id);