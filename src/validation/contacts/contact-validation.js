import { z } from "zod";

export const CONTACT_FIELD_LIMITS = {
  name: 100,
  email: 254,
  phone: 25,
  city: 80,
  topic: 80,
  message: 2000,
};

export const MAX_MAILTO_LENGTH = 8000;

const CONTACT_FORM_SCHEMA = z
  .object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    city: z.string(),
    topic: z.string(),
    message: z.string(),
  })
  .superRefine((values, context) => {
    const errors = {};
    const singleLineFields = ["name", "email", "phone", "city", "topic"];

    for (const field of Object.keys(CONTACT_FIELD_LIMITS)) {
      if (hasUnpairedSurrogate(values[field])) {
        errors[field] = "Please remove unsupported characters from this field.";
      }
      if (values[field].length > CONTACT_FIELD_LIMITS[field]) {
        errors[field] ??= `Please keep this field to ${CONTACT_FIELD_LIMITS[field]} characters or fewer.`;
      }
    }

    if (!values.name) {
      errors.name = "Please enter your full name.";
    } else if (/[\u0000-\u001f\u007f]/.test(values.name)) {
      errors.name = "Please enter your name on a single line.";
    }

    if (!values.email) {
      errors.email = "Please enter your email address.";
    } else if (
      values.email.length > CONTACT_FIELD_LIMITS.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
    ) {
      errors.email = "Please enter a valid email address.";
    }

    if (!values.topic) {
      errors.topic = "Please enter a topic.";
    }
    if (!values.city) {
      errors.city = "Please enter your city or region.";
    }

    for (const field of singleLineFields) {
      if (values[field] && /[\u0000-\u001f\u007f]/.test(values[field])) {
        errors[field] ??= "Please enter this information on a single line.";
      }
    }

    if (values.phone) {
      const phoneDigits = values.phone.replace(/\D/g, "");
      if (
        !/^\+?[0-9][0-9\s().-]*$/.test(values.phone) ||
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
      ) {
        errors.phone = "Please enter a valid phone number, or leave this field blank.";
      }
    }

    if (!values.message) {
      errors.message = "Please enter your message.";
    } else if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(values.message)) {
      errors.message = "Please remove unsupported control characters from your message.";
    }

    for (const [field, message] of Object.entries(errors)) {
      context.addIssue({ code: "custom", path: [field], message });
    }
  });

function hasUnpairedSurrogate(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const nextCode = value.charCodeAt(index + 1);
      if (index + 1 >= value.length || nextCode < 0xdc00 || nextCode > 0xdfff) {
        return true;
      }
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }
  return false;
}

export function validateContactForm(formData) {
  const source = formData && typeof formData === "object" ? formData : {};
  const values = Object.fromEntries(
    Object.keys(CONTACT_FIELD_LIMITS).map((field) => [
      field,
      typeof source[field] === "string" ? source[field].trim() : "",
    ])
  );
  const result = CONTACT_FORM_SCHEMA.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string") {
      errors[field] = issue.message;
    }
  }

  return { values, errors };
}
