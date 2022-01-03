using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace BM.GeneralLinksComponent.Models.LinkTypes
{
    [Serializable]
    public class BaseLink : ILink
    {
        [JsonProperty("url")]
        [Display(Name = "URL:")]
        [MaxLength(2000, ErrorMessage = "URL cannot be longer than 2000 characters.")]
        public virtual Uri Url { get; set; }
    }
}
