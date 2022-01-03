using BM.GeneralLinksComponent.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace BM.GeneralLinksComponent.Models.LinkTypes
{
    [Serializable]
    public class ExternalLink : BaseLink, ILink
    {
        [RequiredIf("LinkType", (int)LinkType.ExternalLink, ErrorMessage = "URL cannot be empty.")]
        [DataType(DataType.Url)]
        [Url(ErrorMessage = "Invalid URL.")]
        public override Uri Url { get; set; }
    }
}
