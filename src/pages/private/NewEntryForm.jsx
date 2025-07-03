// src/pages/private/NewEntryForm.jsx
import React, { useState, useCallback } from 'react';
import Select from 'react-select';
import { Input } from '../../components/ui/Input';
import { STATIC_JOB_FUNCTIONS_OPTIONS, STATIC_TAGS_OPTIONS, RegexConfig, UI_MESSAGES, DUMMY_API_DELAY_MS } from '../../config';
import { deepClone } from '../../utils/deepClone';
import { makePostRequest } from '../../http/http-service';
import { useNavigate } from 'react-router-dom';

const initialErrors = {
    name: null,
    email: null,
    phone: null,
    countryCode: null,
    linkedinProfileLink: null,
    jobFunction: null,
    tags: null,
    comment: null,
    submit: null,
};

const initialFormFields = {
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    linkedinProfileLink: "",
    jobFunction: null,
    tags: [],
    comment: "",
}

  const initialIsDirty = {
    name: false,
    email: false,
    phone: false,
    countryCode: false,
    linkedinProfileLink: false,
    jobFunction: false,
    tags: false,
    comment: false,
  }


const NewEntryForm = ({ onSuccess, toggle }) => {
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState(initialFormFields);
  const [isDirty, setIsDirty] = useState(initialIsDirty);
  const [errors, setErrors] = useState(initialErrors);


  const  _onClose = () => {
   _resetFormFields();
    toggle();
  };

  const _resetFormFields = useCallback(() => {
    setFormFields(initialFormFields)
    setIsDirty(initialIsDirty)
    setErrors(initialErrors)
    setLoading(false);
    setSubmitMessage(null);
  }, []);

  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const _validateFormField = useCallback(
    ({ currentFormfields, currentIsDirty }) => {
      const newErrors = deepClone(initialErrors);
      const updatedIsDirty = deepClone(currentIsDirty);
      let isFormValid = true;

      newErrors.submit = null;


      Object.keys(currentFormfields).forEach((key) => {
        if (updatedIsDirty[key] ) {
          switch (key) {
            case "name": {
              if (!currentFormfields[key]?.trim()?.length) {
                newErrors[key] = UI_MESSAGES.REQUIRED_FIELD("Name");
                isFormValid = false;
              } else if (!RegexConfig.name.test(currentFormfields[key].trim())) {
                newErrors[key] = UI_MESSAGES.NAME_INVALID;
                isFormValid = false;
              } else {
                newErrors[key] = null;
                updatedIsDirty[key] = false;
              }
              break;
            }
            case "email": {
              if (!currentFormfields[key]?.trim()?.length) {
                newErrors[key] = UI_MESSAGES.REQUIRED_FIELD("Email");
                isFormValid = false;
              } else if (!RegexConfig.email.test(currentFormfields[key].trim())) {
                newErrors[key] = UI_MESSAGES.EMAIL_INVALID;
                isFormValid = false;
              } else {
                newErrors[key] = null;
                updatedIsDirty[key] = false;
              }
              break;
            }
            case "phone": {
              if (!currentFormfields[key]?.trim()?.length) {
                newErrors[key] = UI_MESSAGES.REQUIRED_FIELD("Phone");
                isFormValid = false;
              } else if (!RegexConfig.phone.test(currentFormfields[key].trim())) {
                newErrors[key] = UI_MESSAGES.PHONE_INVALID;
                isFormValid = false;
              } else {
                newErrors[key] = null;
                updatedIsDirty[key] = false;
              }
              break;
            }
            case "countryCode": {
                if (!currentFormfields[key]?.trim()?.length) {
                    newErrors[key] = UI_MESSAGES.REQUIRED_FIELD("Country Code");
                    isFormValid = false;
                } else {
                    newErrors[key] = null;
                    updatedIsDirty[key] = false;
                }
                break;
            }
            case "linkedinProfileLink": {
              if (currentFormfields[key]?.trim().length > 0 && !RegexConfig.linkedin.test(currentFormfields[key].trim())) {
                newErrors[key] = UI_MESSAGES.LINKEDIN_INVALID;
                isFormValid = false;
              } else {
                newErrors[key] = null;
                updatedIsDirty[key] = false;
              }
              break;
            }
            case "jobFunction": {
              if (!currentFormfields[key]) {
                newErrors[key] = UI_MESSAGES.REQUIRED_FIELD("Job Function");
                isFormValid = false;
              } else {
                newErrors[key] = null;
                updatedIsDirty[key] = false;
              }
              break;
            }
            case "comment": {
                newErrors[key] = null;
                updatedIsDirty[key] = false;
                break;
            }
            case "tags": {
                newErrors[key] = null;
                updatedIsDirty[key] = false;
                break;
            }
            default:
              break;
          }
        }
      });

      setErrors(newErrors)
      setIsDirty(updatedIsDirty)

      return isFormValid;
    },
    []
  );

  const _onChangeFormField = (key, value) => {
    console.log({key, value});
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };

    newFormFields[key] = value;
    newIsDirty[key] = true;
    if (key === 'tags') {
        const tagsArray = Array.isArray(value) ? value : (value ? [value] : []);
        const selectedTagLabels = tagsArray.map(tag => tag.label);
        newFormFields.comment = selectedTagLabels.join(', ');
        newIsDirty.comment = true;
    }
    setFormFields(newFormFields);
    setIsDirty(newIsDirty);

    _validateFormField({currentFormfields: newFormFields, currentIsDirty: newIsDirty});
  };

  const _markAllIsDirty = useCallback(() => {
    return new Promise((resolve) => {
      const newIsDirty = deepClone(isDirty);
      Object.keys(newIsDirty).forEach((key) => {
        if (typeof newIsDirty[key] === 'boolean') {
          newIsDirty[key] = true;
        }
      });
      setIsDirty(newIsDirty);
      resolve(newIsDirty);
    });
  }, [isDirty]);

  const createPayload = useCallback(() => {
    const tagsToProcess = Array.isArray(formFields.tags) ? formFields.tags : (formFields.tags ? [formFields.tags] : []);
    const selectedTagsLabels = tagsToProcess.map(tag => tag.label);

    let finalNote = formFields.comment.trim();

    if (selectedTagsLabels.length > 0) {
      const tagsString = selectedTagsLabels.join(', ');
      if (finalNote) {
        finalNote = `${tagsString}. ${finalNote}`;
      } else {
        finalNote = tagsString;
      }
    }

    return {
      email: formFields.email.trim(),
      phone: formFields.phone.trim(),
      countryCode: formFields.countryCode.trim(),
      linkedinProfileLink: formFields.linkedinProfileLink.trim() || undefined,
      name: {
        first: formFields.name.trim()
      },
      _jobFunction: formFields.jobFunction ? formFields.jobFunction.value : undefined,
      note: finalNote || undefined
    };
  }, [formFields]);

  const _onSubmit = async (e) => {
    if (e) e.preventDefault();

    setSubmitMessage(null);
    setLoading(true);

    const currentIsDirtyState = await _markAllIsDirty();
    const isFormValid = _validateFormField({
      currentFormfields: formFields,
      currentIsDirty: currentIsDirtyState,
    });

    if (!isFormValid) {
      setSubmitMessage({ type: "error", text: UI_MESSAGES.FORM_INVALID });
      setLoading(false);
      return;
    }

    const payload = createPayload();
    console.log("API Payload:", payload);

    try {
      const data = await makePostRequest(
        'https://api-dev.smoothire.com/api/v1/create/activity/external/user',
        true, 
        payload
      );
      if (onSuccess) onSuccess();
      _onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">New Entry</h2>
      <form onSubmit={_onSubmit} className="space-y-4">
        {submitMessage && (
          <div
            className={`p-3 rounded-md text-sm ${
              submitMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <Input
            id="name"
            type="text"
            value={formFields.name}
            onChange={(e) => _onChangeFormField('name', e.target.value)}
            placeholder="Enter name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
          <Input
            id="email"
            type="email"
            value={formFields.email}
            onChange={(e) => _onChangeFormField('email', e.target.value)}
            placeholder="Enter email"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1">Country Code <span className="text-red-500">*</span></label>
            <Input
              id="countryCode"
              type="text"
              value={formFields.countryCode}
              onChange={(e) => _onChangeFormField('countryCode', e.target.value)}
              placeholder="+91"
              className={errors.countryCode ? "border-red-500" : ""}
            />
            {errors.countryCode && <p className="mt-1 text-sm text-red-600">{errors.countryCode}</p>}
          </div>
          <div className="col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
            <Input
              id="phone"
              type="tel"
              value={formFields.phone}
              onChange={(e) => _onChangeFormField('phone', e.target.value)}
              placeholder="Enter phone number"
              className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>
      </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <Input
            id="location"
            type="text"
            placeholder="Enter location (data to be provided)"
          />
        </div>

        <div>
          <label htmlFor="jobFunction" className="block text-sm font-medium text-gray-700 mb-1">Job Function <span className="text-red-500">*</span></label>
          <Select
            id="jobFunction"
            options={STATIC_JOB_FUNCTIONS_OPTIONS}
            value={formFields.jobFunction}
            onChange={(selectedOption) => _onChangeFormField('jobFunction', selectedOption)}
            placeholder="Select job function"
            classNamePrefix="react-select"
            className={errors.jobFunction ? "border border-red-500 rounded-md" : ""}
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: 'white',
                borderColor: errors.jobFunction ? '#ef4444' : (state.isFocused ? '#6366f1' : '#d1d5db'),
                boxShadow: errors.jobFunction ? '0 0 0 1px #ef4444' : (state.isFocused ? '0 0 0 1px #6366f1' : 'none'),
                '&:hover': {
                  borderColor: state.isFocused ? '#6366f1' : '#a0aec0',
                },
                color: '#1f2937',
              }),
              singleValue: (provided) => ({ ...provided, color: '#1f2937' }),
              placeholder: (provided) => ({ ...provided, color: '#9ca3af' }),
              menu: (provided) => ({ ...provided, backgroundColor: 'white', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? '#e0e7ff' : 'white',
                  color: '#1f2937',
                  '&:active': {
                    backgroundColor: '#c7d2fe',
                  },
                }),
              }}
            />
            {errors.jobFunction && <p className="mt-1 text-sm text-red-600">{errors.jobFunction}</p>}
          </div>

          <div>
            <label htmlFor="linkedinProfileLink" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
            <Input
              id="linkedinProfileLink"
              type="url"
              value={formFields.linkedinProfileLink}
              onChange={(e) => _onChangeFormField('linkedinProfileLink', e.target.value)}
              placeholder="https://www.linkedin.com/in/profile"
              className={errors.linkedinProfileLink ? "border-red-500" : ""}
            />
            {errors.linkedinProfileLink && <p className="mt-1 text-sm text-red-600">{errors.linkedinProfileLink}</p>}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <Select
              id="tags"
              options={STATIC_TAGS_OPTIONS}
              value={formFields.tags}
              onChange={(selectedOptions) => _onChangeFormField('tags', selectedOptions || [])}
              placeholder="Select tags"
              classNamePrefix="react-select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: 'white',
                  borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
                  '&:hover': {
                    borderColor: state.isFocused ? '#6366f1' : '#a0aec0',
                  },
                  multiValue: (provided) => ({ ...provided, backgroundColor: '#e0e7ff', color: '#1f2937' }),
                  multiValueLabel: (provided) => ({ ...provided, color: '#1f2937' }),
                  placeholder: (provided) => ({ ...provided, color: '#9ca3af' }),
                  menu: (provided) => ({ ...provided, backgroundColor: 'white', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? '#e0e7ff' : 'white',
                    color: '#1f2937',
                    '&:active': {
                      backgroundColor: '#c7d2fe',
                    },
                  }),
                }),
              }}
            />
            {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              id="comment"
              value={formFields.comment}
              onChange={(e) => _onChangeFormField('comment', e.target.value)}
              placeholder="Add comments or notes..."
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2
                         bg-white text-gray-900 ${errors.comment ? "border-red-500" : ""}`}
            ></textarea>
            {errors.comment && <p className="mt-1 text-sm text-red-600">{errors.comment}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={_onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Add
            </button>
          </div>
        </form>
      </div>
  );
};

export default NewEntryForm;
