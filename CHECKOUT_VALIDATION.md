# Checkout Validation Documentation

## Overview
Comprehensive validation system for the Furnit e-commerce checkout process, ensuring data integrity and user experience.

## Validation Rules

### Customer Information

#### Full Name
- **Required**: Yes
- **Format**: First name and last name (minimum 2 characters each)
- **Regex**: `/^[a-zA-Z]{2,}\s+[a-zA-Z]{2,}(\s+[a-zA-Z]+)*$/`
- **Examples**:
  - ✅ Valid: "John Doe", "Mary Jane Smith", "Jean Paul"
  - ❌ Invalid: "John", "J Doe", "John123", "john@doe"
- **Error Message**: "Please enter your full name (first and last name)"

#### Email Address
- **Required**: Yes
- **Format**: Standard email format
- **Regex**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Examples**:
  - ✅ Valid: "john@example.com", "user.name@domain.co.rw"
  - ❌ Invalid: "john@", "@example.com", "john.example.com"
- **Error Message**: "Please enter a valid email address"
- **Processing**: Trimmed and converted to lowercase before storage

#### Phone Number (Rwanda)
- **Required**: Yes
- **Format**: Rwanda mobile number format
- **Regex**: `/^(\+?250|0)?7[0-9]{8}$/`
- **Accepted Formats**:
  - `+250 788 123 456`
  - `0788 123 456`
  - `250788123456`
  - `788123456`
- **Examples**:
  - ✅ Valid: "+250788123456", "0788123456", "788123456"
  - ❌ Invalid: "+250688123456" (must start with 7), "078812345" (wrong length)
- **Error Message**: "Please enter a valid Rwanda phone number (e.g., +250 7XX XXX XXX or 07XX XXX XXX)"
- **Processing**: Normalized to `+250` format before storage
- **Normalization**:
  - `0788123456` → `+250788123456`
  - `788123456` → `+250788123456`
  - `250788123456` → `+250788123456`

### Delivery Information

#### Street Address
- **Required**: Yes
- **Minimum Length**: 10 characters
- **Format**: Free text
- **Examples**:
  - ✅ Valid: "KG 123 St, House #45", "Avenue de la Paix, Building 7"
  - ❌ Invalid: "KG 123" (too short)
- **Error Message**: "Please enter a complete delivery address (at least 10 characters)"
- **Processing**: Trimmed and sanitized

#### City
- **Required**: Yes
- **Default**: "Kigali"
- **Format**: Fixed value (read-only)

#### District
- **Required**: Yes
- **Options**: Gasabo, Kicukiro, Nyarugenge
- **Error Message**: "Please select a district"

#### Sector
- **Required**: Yes
- **Options**: Depends on selected district
- **Validation**: Must select district first
- **Error Message**: "Please select a sector"
- **Districts and Sectors**:
  - **Gasabo**: Bumbogo, Gatsata, Jali, Gikomero, Gisozi, Jabana, Kinyinya, Ndera, Nduba, Remera, Rusororo, Rutunga
  - **Kicukiro**: Gahanga, Gatenga, Gikondo, Kagarama, Kanombe, Kicukiro, Kigarama, Masaka, Niboye, Nyarugunga
  - **Nyarugenge**: Gitega, Kanyinya, Kigali, Kimisagara, Mageragere, Muhima, Nyakabanda, Nyamirambo, Nyarugenge, Rwezamenyo

#### Delivery Date
- **Required**: Yes
- **Format**: Date (YYYY-MM-DD)
- **Constraints**:
  - Cannot be in the past
  - Cannot be more than 90 days in the future
- **Error Messages**:
  - "Delivery date cannot be in the past"
  - "Delivery date cannot be more than 90 days in the future"
- **Minimum**: Today's date

#### Delivery Time
- **Required**: Yes
- **Options**:
  - `morning`: Morning (8AM - 12PM)
  - `afternoon`: Afternoon (12PM - 4PM)
  - `evening`: Evening (4PM - 8PM)
- **Default**: "morning"

#### Special Instructions
- **Required**: No
- **Format**: Free text (textarea)
- **Processing**: Trimmed, stored as null if empty

### Payment Information

#### Payment Method
- **Required**: Yes
- **Options**:
  - `momo`: Mobile Money (MTN, Airtel)
  - `bank`: Bank Transfer
- **Default**: "momo"

#### Mobile Money (if method = 'momo')

##### Provider
- **Required**: Yes
- **Options**: MTN, Airtel
- **Default**: "MTN"

##### Mobile Money Number
- **Required**: Yes (if Mobile Money selected)
- **Format**: Same as customer phone number
- **Regex**: `/^(\+?250|0)?7[0-9]{8}$/`
- **Error Message**: "Please enter a valid Mobile Money number (e.g., +250 7XX XXX XXX)"
- **Processing**: Normalized to `+250` format
- **Note**: User will receive payment prompt on this number

#### Bank Transfer (if method = 'bank')

##### Bank Name
- **Required**: Yes
- **Options**:
  - Bank of Kigali
  - Equity Bank
  - I&M Bank
  - KCB Bank
  - Cogebanque
- **Default**: "Bank of Kigali"

##### Bank Account Number
- **Required**: Yes (if Bank Transfer selected)
- **Format**: 10-16 digits
- **Regex**: `/^[0-9]{10,16}$/`
- **Examples**:
  - ✅ Valid: "1234567890", "1234567890123456"
  - ❌ Invalid: "123456789" (too short), "12345678901234567" (too long), "123ABC456" (contains letters)
- **Error Message**: "Please enter a valid bank account number (10-16 digits)"
- **Processing**: Spaces removed before validation and storage
- **Note**: Payment instructions sent to customer email

### Order Notes
- **Required**: No
- **Format**: Free text (textarea)
- **Processing**: Trimmed, stored as null if empty

## Validation Flow

### Step 1: Customer Information
1. User enters full name, email, and phone
2. Real-time validation on blur (field loses focus)
3. Visual feedback with red border and error message
4. Cannot proceed to next step until all fields valid

### Step 2: Delivery Information
1. User enters address, selects district/sector, date, time
2. Address length validation (min 10 chars)
3. Date validation (not past, not >90 days future)
4. Sector dropdown enabled only after district selection
5. Cannot proceed until all required fields valid

### Step 3: Payment Method
1. User selects payment method (Mobile Money or Bank)
2. Conditional fields appear based on selection
3. Phone number validation for Mobile Money
4. Bank account validation for Bank Transfer
5. Cannot proceed until payment details valid

### Step 4: Review Order
1. All information displayed for review
2. User can add optional order notes
3. Final validation before submission
4. All data sanitized and normalized

## Real-Time Validation

### On Blur Validation
Fields validate when user leaves the field (blur event):
- Full Name
- Email Address
- Phone Number
- Mobile Money Number
- Bank Account Number

### Visual Feedback
- **Valid**: Green checkmark (optional)
- **Invalid**: Red border + error message below field
- **Helper Text**: Gray text showing format examples

### Error Display
```jsx
{validationErrors.fieldName && (
    <p className="text-xs text-red-600 mt-1 ml-1">
        {validationErrors.fieldName}
    </p>
)}
```

## Data Processing

### Before Storage
1. **Trim**: Remove leading/trailing whitespace
2. **Sanitize**: Remove potentially harmful characters
3. **Normalize**:
   - Phone numbers → `+250` format
   - Email → lowercase
   - Bank account → remove spaces
4. **Null Handling**: Empty optional fields stored as `null`

### Phone Number Normalization
```javascript
// Input: "0788123456"
// Output: "+250788123456"

// Input: "788123456"
// Output: "+250788123456"

// Input: "+250 788 123 456"
// Output: "+250788123456"
```

### Email Normalization
```javascript
// Input: "  John@Example.COM  "
// Output: "john@example.com"
```

## Error Handling

### Client-Side Errors
- Field-level validation errors
- Step-level validation errors
- Form submission errors

### Server-Side Errors
- Database insertion errors
- Network errors
- Authentication errors

### Error Display
- Alert box at top of form
- Red border on invalid fields
- Inline error messages
- Scroll to error on submission

## Security Measures

### Input Sanitization
- Remove script tags
- Trim whitespace
- Validate format before processing

### SQL Injection Prevention
- Supabase parameterized queries
- No raw SQL from user input

### XSS Prevention
- React automatic escaping
- Sanitize before storage
- Validate on both client and server

## Testing Checklist

### Customer Information
- [ ] Full name with 2+ words validates
- [ ] Single name shows error
- [ ] Email format validates correctly
- [ ] Invalid email shows error
- [ ] Rwanda phone formats accepted
- [ ] Non-Rwanda phone rejected
- [ ] Phone normalized correctly

### Delivery Information
- [ ] Short address (<10 chars) rejected
- [ ] District selection required
- [ ] Sector depends on district
- [ ] Past date rejected
- [ ] Future date (>90 days) rejected
- [ ] Today's date accepted

### Payment Information
- [ ] Mobile Money number validates
- [ ] Bank account (10-16 digits) validates
- [ ] Short account number rejected
- [ ] Long account number rejected
- [ ] Letters in account number rejected

### Form Flow
- [ ] Cannot skip steps
- [ ] Can go back to previous steps
- [ ] Validation runs on next button
- [ ] Final validation on submit
- [ ] Success message after submission
- [ ] Cart cleared after order

### Data Storage
- [ ] Phone numbers stored with +250
- [ ] Email stored in lowercase
- [ ] Empty optional fields as null
- [ ] All required fields present
- [ ] Order saved to Supabase
- [ ] User can view order in dashboard

## Best Practices

1. **Progressive Disclosure**: Show validation errors only after user interaction
2. **Clear Messaging**: Specific error messages with examples
3. **Visual Feedback**: Color-coded borders and icons
4. **Helper Text**: Show format examples before errors
5. **Accessibility**: Proper labels and ARIA attributes
6. **Mobile Friendly**: Touch-friendly inputs and buttons
7. **Performance**: Debounce real-time validation
8. **Security**: Validate on both client and server

## Future Enhancements

1. **Address Autocomplete**: Google Maps API integration
2. **Phone Verification**: SMS OTP verification
3. **Email Verification**: Send confirmation code
4. **Bank Account Verification**: Check with bank API
5. **Delivery Date Availability**: Check delivery slots
6. **Payment Integration**: Real-time payment processing
7. **Order Tracking**: SMS/Email notifications
8. **Multi-language**: Support Kinyarwanda, French
