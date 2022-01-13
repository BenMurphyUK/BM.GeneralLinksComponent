using BM.GeneralLinksComponent.Attributes;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace BM.GeneralLinksComponent.LinkTypes
{
    [Serializable]
    public class PhoneNumberLink : BaseLink, ILink
    {
        [JsonProperty("phoneNumber")]
        [Display(Name = "Phone Number:")]
        [DataType(DataType.PhoneNumber)]
        [Phone(ErrorMessage = "Invalid phone number.")]
        [RequiredIf("LinkType", (int)LinkType.PhoneNumber, ErrorMessage = "Phone number cannot be empty.")]
        [MaxLength(20, ErrorMessage = "The phone number cannot be longer than 20 characters.")]
        public string PhoneNumber { get; set; }
    }
}
