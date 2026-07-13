Build a simple BMI (Body Mass Index) calculator for adults.

## Goal

Create a reusable function that calculates BMI for adults (18 years and older).

## Inputs

* Weight in kilograms (kg)
* Height in centimeters (cm)

## Formula

1. Convert height from centimeters to meters:

```text
height_m = height_cm / 100
```

2. Calculate BMI:

```text
BMI = weight_kg / (height_m × height_m)
```

3. Round the result to one decimal place.

## BMI Categories (Adults)

* BMI < 18.5 → Underweight
* BMI ≥ 18.5 and < 25.0 → Healthy weight
* BMI ≥ 25.0 and < 30.0 → Overweight
* BMI ≥ 30.0 → Obesity

## Validation

* Weight must be greater than 0.
* Height must be greater than 0.
* Accept decimal values for both weight and height.
* Display a clear error message if the input is invalid.

## Example

**Input**

* Weight: 75 kg
* Height: 180 cm

**Calculation**

```text
height_m = 1.80
BMI = 75 / (1.80 × 1.80)
BMI = 23.1
```

**Output**

```text
BMI: 23.1
Category: Healthy weight
```

## Implementation Requirements

* Write clean, modular, and well-documented code.
* Keep the BMI calculation logic separate from the UI.
* Make the calculation function reusable.
* Ensure the implementation is easy to extend in the future (for example, adding BMI calculations for children, an ideal weight calculator, or support for imperial units).
* Use standard WHO BMI classifications for adults.
* The calculation should be accurate and consistent across all supported devices and platforms.
