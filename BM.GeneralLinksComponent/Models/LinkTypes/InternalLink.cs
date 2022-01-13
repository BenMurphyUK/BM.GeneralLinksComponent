using BM.GeneralLinksComponent.Attributes;
using Kentico.Components.Web.Mvc.FormComponents;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace BM.GeneralLinksComponent.LinkTypes
{
    [Serializable]
    public class InternalLink : BaseLink, ILink
    {
        [RequiredIf("LinkType", (int)LinkType.InternalLink, ErrorMessage = "URL cannot be empty, please select an internal link.")]
        public override Uri Url { get; set; }

        [JsonProperty("internalReferenceGuid")]
        public Guid InternalReferenceGuid { get; set; }

        [JsonProperty("internalReferenceType")]
        [JsonConverter(typeof(StringEnumConverter))]
        public ContentSelectorTabs InternalReferenceType { get; set; }
    }
}
