using BM.GeneralLinksComponent.Attributes;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace BM.GeneralLinksComponent.Models.LinkTypes
{
    [Serializable]
    public class EmailLink : BaseLink, ILink
    {
        [JsonProperty("emailAddress")]
        [Display(Name = "Email address:")]
        [DataType(DataType.EmailAddress)]
        [RequiredIf("LinkType", (int)LinkType.Mailto, ErrorMessage = "Email address cannot be empty.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        [MaxLength(254, ErrorMessage = "Email address cannot be longer than 254 characters.")]
        public string EmailAddress { get; set; }

        [JsonProperty("emailCc")]
        [Display(Name = "CC:")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Invalid CC email address.")]
        [MaxLength(254, ErrorMessage = "CC email address cannot be longer than 254 characters.")]
        public string EmailCc { get; set; }

        [JsonProperty("emailBcc")]
        [Display(Name = "BCC:")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Invalid BCC email address.")]
        [MaxLength(254, ErrorMessage = "BCC email address cannot be longer than 254 characters.")]
        public string EmailBcc { get; set; }

        [JsonProperty("emailSubject")]
        [Display(Name = "Subject:")]
        [MaxLength(254, ErrorMessage = "Subject cannot be longer than 254 characters.")]
        public string EmailSubject { get; set; }

        [JsonProperty("emailBody")]
        [Display(Name = "Body:")]
        public string EmailBody { get; set; }
    }
}
