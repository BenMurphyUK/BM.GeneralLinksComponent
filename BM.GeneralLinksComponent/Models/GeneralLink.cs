using BM.GeneralLinksComponent.Attributes;
using BM.GeneralLinksComponent.JsonConverters;
using BM.GeneralLinksComponent.Models.LinkTypes;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace BM.GeneralLinksComponent.Models
{
    [Serializable]
    [JsonConverter(typeof(GeneralLinkConverter))]
    public class GeneralLink
    {
        [JsonProperty("linkText")]
        [Display(Name = "Link text:")]
        [Required(ErrorMessage = "Link text cannot be empty.")]
        [MaxLength(254, ErrorMessage = "Link text cannot be longer than 254 characters.")]
        public string LinkText { get; set; }

        [JsonProperty("linkType")]
        [Display(Name = "Link type:")]
        public LinkType LinkType { get; set; }

        [JsonProperty("link")]
        public ILink Link { get; set; }

        [JsonProperty("anchorOrQueryString")]
        [Display(Name = "Anchor / query string:")]
        [RequiredIf("LinkType", (int)LinkType.AnchorOrQueryStringOnly, ErrorMessage = "Anchor / query string cannot be empty.")]
        [MaxLength(1000, ErrorMessage = "Anchor / query string cannot be longer than 1000 characters.")]
        [RegularExpression(@"^[\?\#]\S+$", ErrorMessage = "Anchor / query is invalid. Examples of valid inputs are: '?key=value', '#myAnchor', or '?key=value#myAnchor'.")]
        public string AnchorOrQueryString { get; set; }

        [JsonProperty("openInNewTab")]
        [Display(Name = "Open in new tab:")]
        public bool OpenInNewTab { get; set; }

        [JsonProperty("customCssClasses")]
        [Display(Name = "CSS Classes:")]
        public string CustomCssClasses { get; set; }

        [JsonProperty("customCssClassesTextbox")]
        public string CustomCssClassesTextbox { get; set; }

        [JsonProperty("customCssClassesDropdown")]
        public string CustomCssClassesDropdown { get; set; }

    }

    [Serializable]
    public enum LinkType
    {
        [Display(Name = "External Link")]
        ExternalLink = 0,

        [Display(Name = "Internal Link")]
        InternalLink = 100,

        [Display(Name = "Email")]
        Mailto = 200,

        [Display(Name = "Phone number")]
        PhoneNumber = 300,

        [Display(Name = "Anchor / query string only")]
        AnchorOrQueryStringOnly = 400
    }
}
